import User from "../models/auth/userModel.js";
import SellerProfile from "../models/user&roles/sellerModel.js";

import { sendError } from "../utils/responseHandling/errorHandling.js";
import { sendSuccess } from "../utils/responseHandling/successHandling.js";

export const switchToSeller = async (req, res) => {
  try {
    const userId = req.userId;

    const sellerProfile = await SellerProfile.findOne({
      user: userId,
    }).select("status");

    if (!sellerProfile) {
      return sendError(
        res,
        409,
        "Please create your seller profile before switching to seller mode."
      );
    }

    if (sellerProfile.status === "suspended") {
      return sendError(res, 403, "Your seller profile is suspended.");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "SELLER" },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("role");

    if (!user) {
      return sendError(res, 401, "User not found.");
    }

    return sendSuccess(
      res,
      200,
      { role: user.role },
      "Switched to seller mode successfully."
    );
  } catch (error) {
    console.error("switchToSeller error:", error);

    return sendError(res, 500, "An internal server error occurred.");
  }
};

export const switchToCustomer = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { role: "CUSTOMER" },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("role");

    if (!user) {
      return sendError(res, 401, "User not found.");
    }

    return sendSuccess(
      res,
      200,
      { role: user.role },
      "Switched to customer mode successfully."
    );
  } catch (error) {
    console.error("switchToCustomer error:", error);

    return sendError(
      res,
      500,
      "An internal server error occurred."
    );
  }
};

