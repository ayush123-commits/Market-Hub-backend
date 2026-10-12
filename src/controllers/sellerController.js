import SellerProfile from "../models/user&roles/sellerModel.js";

import {
  sendError,
} from "../utils/responseHandling/errorHandling.js";

import {
  sendSuccess,
} from "../utils/responseHandling/successHandling.js";


// CREATE SELLER PROFILE
export const createSellerProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      displayName,
      description,
      logo,
      contactEmail,
      contactPhone,
    } = req.body;

    // Validate required field
    if (
      typeof displayName !== "string" ||
      !displayName.trim()
    ) {
      return sendError(
        res,
        400,
        "Seller display name is required."
      );
    }

    // Prevent duplicate seller profiles
    const existingProfile = await SellerProfile.findOne({
      user: userId,
    });

    if (existingProfile) {
      return sendError(
        res,
        409,
        "You already have a seller profile."
      );
    }

    // Create seller profile
    const sellerProfile = await SellerProfile.create({
      user: userId,
      displayName,
      description,
      logo,
      contactEmail,
      contactPhone,
      // status defaults to "draft"
    });

    return sendSuccess(
      res,
      201,
      sellerProfile,
      "Seller profile created successfully."
    );
  } catch (error) {
    console.error("createSellerProfile error:", error);

    // Handles duplicate-key errors, including concurrent requests
    if (error.code === 11000) {
      return sendError(
        res,
        409,
        "A seller profile already exists for this user."
      );
    }

    if (error.name === "ValidationError") {
      return sendError(
        res,
        400,
        "Invalid seller profile data."
      );
    }

    return sendError(
      res,
      500,
      "An internal server error occurred."
    );
  }
};


// GET MY SELLER PROFILE
export const getMySellerProfile = async (req, res) => {
  try {
    const sellerProfile = await SellerProfile.findOne({
      user: req.userId,
    });

    if (!sellerProfile) {
      return sendError(
        res,
        404,
        "Seller profile not found."
      );
    }

    return sendSuccess(
      res,
      200,
      sellerProfile,
      "Seller profile retrieved successfully."
    );
  } catch (error) {
    console.error("getMySellerProfile error:", error);

    return sendError(
      res,
      500,
      "An internal server error occurred."
    );
  }
};


// UPDATE MY SELLER PROFILE
export const updateSellerProfile = async (req, res) => {
  try {
    const allowedFields = [
      "displayName",
      "description",
      "logo",
      "contactEmail",
      "contactPhone",
    ];

    const updates = {};

    // Only allow explicitly permitted fields
    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return sendError(
        res,
        400,
        "No valid profile fields were provided."
      );
    }

    if (
      Object.prototype.hasOwnProperty.call(
        updates,
        "displayName"
      ) &&
      (
        typeof updates.displayName !== "string" ||
        !updates.displayName.trim()
      )
    ) {
      return sendError(
        res,
        400,
        "Seller display name cannot be empty."
      );
    }

    const sellerProfile =
      await SellerProfile.findOneAndUpdate(
        { user: req.userId },
        { $set: updates },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!sellerProfile) {
      return sendError(
        res,
        404,
        "Seller profile not found."
      );
    }

    return sendSuccess(
      res,
      200,
      sellerProfile,
      "Seller profile updated successfully."
    );
  } catch (error) {
    console.error("updateSellerProfile error:", error);

    if (error.name === "ValidationError") {
      return sendError(
        res,
        400,
        "Invalid seller profile data."
      );
    }

    return sendError(
      res,
      500,
      "An internal server error occurred."
    );
  }
};
