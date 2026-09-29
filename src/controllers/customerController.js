import mongoose from "mongoose";
import User from "../models/auth/userModel.js";
import CustomerAddress from "../models/Adress/customerAddressModel.js";
import CustomerProfile from "../models/user&roles/customermodel.js";

import { sendError } from "../utils/responseHandling/errorHandling.js";
import { sendSuccess } from "../utils/responseHandling/successHandling.js";

export const getMyCustomerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    const customerProfile = await CustomerProfile.findOne({
      user: userId,
    });
    if (!customerProfile) {
      return sendError(res, 404, "Customer profile not found, Create one");
    }

    const customer = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      phone: customerProfile.phone,
      avatar: customerProfile.avatar,
    };

    return sendSuccess(
      res,
      200,
      customer,
      "Customer profile fetched successFully"
    );
  } catch (error) {
    return sendError(res, 500, `Internal server error ${error}`);
  }
};

export const createCustomerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { phone, avatar } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 404, "User not found");
    }
    const existingProfile = await CustomerProfile.findOne({
      user: userId,
    });

    if (existingProfile) {
      return sendError(res, 409, "Customer profile already exists");
    }
    const customerProfile = await CustomerProfile.create({
      user: userId,
      phone: phone || null,
      avatar: avatar || null,
    });
    return sendSuccess(
      res,
      201,
      customerProfile,
      "Customer profile created successfully"
    );
  } catch (error) {
    return sendError(res, 500, `Internal server error ${error}`);
  }
};

export const updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const customerProfile = await CustomerProfile.findOne({
      user: userId,
    });
    if (!customerProfile) {
      return sendError(
        res,
        404,
        "Customer profile not found, create one first"
      );
    }
    const { phone, avatar } = req.body;

    if (phone !== undefined) {
      customerProfile.phone = phone;
    }

    if (avatar !== undefined) {
      customerProfile.avatar = avatar;
    }
    await customerProfile.save();
    return sendSuccess(
      res,
      200,
      customerProfile,
      "Customer profile updated successfully"
    );
  } catch (error) {
    return sendError(res, 500, `Internal server error ${error}`);
  }
};

export const createCustomerAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      label,
      recipientName,
      recipientPhone,
      address,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;
    const requiredFields = {
      recipientName,
      recipientPhone,
      address,
      city,
      state,
      postalCode,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (typeof value !== "string" || !value.trim()) {
        return sendError(res, 400, `${field} is required`);
      }
    }
    if (isDefault === true) {
      await CustomerAddress.updateMany(
        {
          user: userId,
          isDefault: true,
        },
        {
          $set: { isDefault: false },
        }
      );
    }
    const customerAddress = await CustomerAddress.create({
      user: userId,
      label,
      recipientName,
      recipientPhone,
      address,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault === true,
    });

    return sendSuccess(
      res,
      201,
      customerAddress,
      "Customer address created successfully"
    );
  } catch (error) {
    return sendError(res, 500, `Internal server error ${error}`);
  }
};

export const getCustomerAddresses = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await CustomerAddress.find({
      user: req.userId,
    })
      .select("-user -__v")
      .sort({ isDefault: -1, createdAt: -1 });
    return sendSuccess(res, 200, addresses, "All addresses are fetched");
  } catch (error) {
    return sendError(res, 500, `Internal server error ${error}`);
  }
};

export const getCustomerAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    const customerAddress = await CustomerAddress.findOne({
      _id: addressId,
      user: userId,
    });

    if (!customerAddress) {
      return sendError(
        res,
        404,
        "Address not found"
      );
    }

    return sendSuccess(
      res,
      200,
      customerAddress,
      "Address fetched successfully"
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

export const updateCustomerAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
  return sendError(res, 400, "Invalid address ID");
}

    const customerAddress = await CustomerAddress.findOne({
      _id: addressId,
      user: userId,
    });

    if (!customerAddress) {
      return sendError(
        res,
        404,
        "Address not found"
      );
    }

    const {
      label,
      recipientName,
      recipientPhone,
      address,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body || {};

    if (Object.keys(req.body || {}).length === 0) {
  return sendError(
    res,
    400,
    "At least one field is required to update the address"
  );
}

    if (label !== undefined) {
      customerAddress.label = label;
    }

    if (recipientName !== undefined) {
      customerAddress.recipientName = recipientName;
    }

    if (recipientPhone !== undefined) {
      customerAddress.recipientPhone = recipientPhone;
    }

    if (address !== undefined) {
      customerAddress.address = address;
    }

    if (landmark !== undefined) {
      customerAddress.landmark = landmark;
    }

    if (city !== undefined) {
      customerAddress.city = city;
    }

    if (state !== undefined) {
      customerAddress.state = state;
    }

    if (postalCode !== undefined) {
      customerAddress.postalCode = postalCode;
    }

    if (country !== undefined) {
      customerAddress.country = country;
    }

    if (isDefault === true) {
      await CustomerAddress.updateMany(
        {
          user: userId,
          _id: { $ne: addressId },
          isDefault: true,
        },
        {
          $set: { isDefault: false },
        }
      );

      customerAddress.isDefault = true;
    }

    if (isDefault === false) {
      customerAddress.isDefault = false;
    }

    await customerAddress.save();

    return sendSuccess(
      res,
      200,
      customerAddress,
      "Customer address updated successfully"
    );
  } catch (error) {

    return sendError(
      res,
      500,
      `Internal server error ${error}`
    );
  }
};

export const deleteCustomerAddress = async (req, res)=>{
 try {
  const userId = req.userId;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return sendError(res, 400, "Invalid address ID");
    }

    const customerAddress = await CustomerAddress.findOneAndDelete({
      _id: addressId,
      user: userId,
    });

    if (!customerAddress) {
      return sendError(res, 404, "Address not found");
    }

    return sendSuccess(
      res,
      200,
      customerAddress,
      "Customer address deleted successfully"
    );
 } catch (error) {
   return sendError(
      res,
      500,
      `Internal server error ${error}`
    );
 } 
}

export const setDefaultCustomerAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return sendError(res, 400, "Invalid address ID");
    }

    const customerAddress = await CustomerAddress.findOne({
      _id: addressId,
      user: userId,
    });

    if (!customerAddress) {
      return sendError(res, 404, "Address not found");
    }

    await CustomerAddress.updateMany(
      {
        user: userId,
        isDefault: true,
      },
      {
        $set: { isDefault: false },
      }
    );

    customerAddress.isDefault = true;

    await customerAddress.save();

    return sendSuccess(
      res,
      200,
      customerAddress,
      "Default address updated successfully"
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