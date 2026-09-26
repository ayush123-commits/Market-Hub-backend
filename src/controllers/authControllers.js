import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user/userModel.js";
import VerificationToken from "../models/user/verificationModel.js";
import { sendError } from "../utils/responseHandling/errorHandling.js";
import { sendSuccess } from "../utils/responseHandling/successHandling.js";
import isStrongPassword from "../utils/passwordValidation.js";
import isValidEmail from "../utils/emailValidation.js";
import generateVerificationCode from "../utils/generateVerificationCode.js";
import { sendResigterEmail, sendVerificationCodeEmail, sendPasswordResetCodeEmail, sendAccountVerifiedEmail } from "../services/emails/emailServices.js";
import user from "../models/user/userModel.js";


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  // if any feild is empty then return

  if (!name || !email || !password) {
    return sendError(res, 400, "Name, email and password are required");
  }
  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  if (!isStrongPassword(password)) {
    return sendError(res, 400, "Inadequate password strength");
  }
  try {
    // check whether the user exists with this email

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "User already exists with this email");
    }

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = {
      name,
      email,
      passwordHash,
      // other fields are default
    };

    const userData = await User.create(user);
    const responseUser = {
      id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isEmailVerified: userData.isEmailVerified,
    };
    // let's send an email to welcome them on our website
    sendResigterEmail(
      userData.email,
      userData.name
    )
    return sendSuccess(res, 201, responseUser, "Register Successfull");
  } catch (error) {
    console.log(error);
    return sendError(res, 500, "Some error occured");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }
  try {
    // check whether the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 401, "User doesn't exists with this email");
    }
    // The user exist, check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return sendError(res, 401, "Incorrect password");
    }
    const token = jwt.sign(
      {
        sub: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return sendSuccess(res, 200, null, "login SuccessFul");
  } catch (error) {
    return sendError(res, 500, "Some error occured");
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return sendSuccess(res, 200, null, "Logout successful");
};

export const sendVerification = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("email isEmailVerified");
    if (!user) {
      return sendError(res, 401, "User no longer exists");
    }
    if (user.isEmailVerified) {
      return sendError(res, 400, "Email is already verified");
    }
    const existingVerificationToken = await VerificationToken.findOne({
      userId,
      purpose: "EMAIL_VERIFICATION",
    });
    const code = generateVerificationCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    if (existingVerificationToken) {
      existingVerificationToken.codeHash = codeHash;
      existingVerificationToken.expiresAt = expiresAt;
      await existingVerificationToken.save();
    } else {
      await VerificationToken.create({
        userId,
        purpose: "EMAIL_VERIFICATION",
        codeHash,
        expiresAt,
      });
    }
    // send code to user email
    sendVerificationCodeEmail(user.email, code)
    // for now let's console
    return sendSuccess(res, 201, null, "Verification code sent successfully");
  } catch (error) {
    return sendError(res, 500, `Internal server error ${error}`);
  }
};

export const emailVerification = async (req, res) => {
  try {
    const userId = req.userId;
    const { code } = req.body;

    if (!userId) {
      return sendError(res, 401, "Unauthenticated user");
    }

    if (!code) {
      return sendError(res, 400, "Enter verification code");
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.isEmailVerified) {
      return sendError(res, 400, "Email is already verified");
    }

    const verificationToken = await VerificationToken.findOne({
      userId,
      purpose: "EMAIL_VERIFICATION",
    });

    if (!verificationToken) {
      return sendError(
        res,
        400,
        "No active verification code found"
      );
    }

    if (verificationToken.expiresAt <= new Date()) {
      return sendError(
        res,
        400,
        "Verification code has expired"
      );
    }

    const isCodeMatched = await bcrypt.compare(
      code,
      verificationToken.codeHash
    );

    if (!isCodeMatched) {
      return sendError(res, 401, "Incorrect code");
    }

    // 1. Verify user
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );

    // 2. Remove verification token
    await VerificationToken.deleteOne({
      _id: verificationToken._id,
    });

    // 3. Send confirmation email
    // Email failure should NOT undo successful verification
    try {
      await sendAccountVerifiedEmail(user.email);
    } catch (emailError) {
      console.error(
        "Account verified email failed:",
        emailError
      );
    }

    // 4. Respond success
    return sendSuccess(
      res,
      200,
      null,
      "Email verified successfully"
    );

  } catch (error) {
    console.error("Email verification error:", error);

    return sendError(
      res,
      500,
      `Internal server error: ${error.message}`
    );
  }
};

export const sendPasswordVerification = async(req, res)=>{
  try {
    const {email} = req.body
    const user = await User.findOne({email})
    if (!user) {
      return sendError(res, 401, "User no longer exists");
    }
    const userId = user._id;
    const existingVerificationToken = await VerificationToken.findOne({
      userId,
      purpose: "PASSWORD_RESET",
    });
    const code = generateVerificationCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    if (existingVerificationToken) {
      existingVerificationToken.codeHash = codeHash;
      existingVerificationToken.expiresAt = expiresAt;
      await existingVerificationToken.save();
    } else {
      await VerificationToken.create({
        userId,
        purpose: "PASSWORD_RESET",
        codeHash,
        expiresAt,
      });
    }
    // send code to user email
    sendPasswordResetCodeEmail(user.email, code)
    return sendSuccess(res, 201, null, "Verification code sent successfully");
  } catch (error) {
    return sendError(res, 500, `Internal server error ${error}`);
  }
}

export const userPasswordUpdate = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return sendError(
        res,
        400,
        "Email, code and password are required"
      );
    }

    if (!isStrongPassword(password)) {
      return sendError(
        res,
        400,
        "Inadequate password strength"
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(
        res,
        400,
        "No user exists with this email"
      );
    }

    const userId = user._id;

    const verificationToken = await VerificationToken.findOne({
      userId,
      purpose: "PASSWORD_RESET",
    });

    if (!verificationToken) {
      return sendError(
        res,
        400,
        "No active password reset code found"
      );
    }

    if (verificationToken.expiresAt <= new Date()) {
      return sendError(
        res,
        400,
        "Verification code has expired"
      );
    }

    const isCodeMatched = await bcrypt.compare(
      code,
      verificationToken.codeHash
    );

    if (!isCodeMatched) {
      return sendError(
        res,
        400,
        "Incorrect verification code"
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          passwordHash,
        },
      }
    );

    // Invalidate the password-reset token
    verificationToken.expiresAt = new Date();
    await verificationToken.save();

    return sendSuccess(
      res,
      200,
      null,
      "Password updated successfully"
    );

  } catch (error) {
    console.error(error);

    return sendError(
      res,
      500,
      "Internal server error"
    );
  }
};