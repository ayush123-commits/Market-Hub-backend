import Product from "../../models/product/productModel.js";
import SellerProfile from "../../models/user&roles/sellerModel.js";
import { sendError } from "../../utils/responseHandling/errorHandling.js";
import { sendSuccess } from "../../utils/responseHandling/successHandling.js";

import {
  uploadProductImages,
  deleteProductImage,
} from "../../services/cloudinary/cloudinary.service.js";



export const createProductDraft = async (req, res, next) => {
  let uploadedImages = [];

  try {
    // I have userId in req.userId
    const userId = req.userId;
    // For this user, find the seller id

    const seller = await SellerProfile.findOne({
      user: userId,
    })
      .select("_id")
      .lean();

    if (!seller) {
      return sendError(
        res,
        403,
        "A seller profile is required to create a product."
      );
    }

    // 3. Extract product details
    const { name, description, category, brand, attributes } = req.body ?? {};

    const errors = {};

    // 4. Validate required fields
    if (typeof name !== "string" || !name.trim()) {
      errors.name = "Product name is required.";
    } else if (name.trim().length > 150) {
      errors.name = "Product name must be 150 characters or fewer.";
    }

    if (typeof description !== "string" || !description.trim()) {
      errors.description = "Product description is required.";
    } else if (description.trim().length > 5000) {
      errors.description = "Description must be 5000 characters or fewer.";
    }

    if (typeof category !== "string" || !category.trim()) {
      errors.category = "Product category is required.";
    } else if (category.trim().length > 100) {
      errors.category = "Category must be 100 characters or fewer.";
    }

    if (brand != null && typeof brand !== "string") {
      errors.brand = "Brand must be a string.";
    } else if (typeof brand === "string" && brand.trim().length > 100) {
      errors.brand = "Brand must be 100 characters or fewer.";
    }

    if (
      attributes !== undefined &&
      (attributes === null ||
        typeof attributes !== "object" ||
        Array.isArray(attributes))
    ) {
      errors.attributes = "Attributes must be an object.";
    }

    // Multer should use memoryStorage for this upload utility.
    const files = req.files ?? [];

    if (!Array.isArray(files)) {
      errors.images = "Invalid image upload format.";
    } else if (files.length > 10) {
      errors.images = "A product can have at most 10 images.";
    }

    if (Object.keys(errors).length > 0) {
      return sendError(res, 400, Object.values(errors).join(" "));
    }

    // 5. Upload images to Cloudinary
    uploadedImages = await uploadProductImages(files);

    const normalizedAttributes = new Map(
  Object.entries(attributes ?? {})
);

    // 6. Create product draft
    const product = await Product.create({
      seller: seller._id,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),

      brand:
        typeof brand === "string" && brand.trim() ? brand.trim() : undefined,

      images: uploadedImages.map((image, index) => ({
        url: image.secure_url,
        public_id: image.public_id,
        altText: name.trim(),
        position: index,
      })),

      attributes: normalizedAttributes ?? {},
      reviewStatus: "draft",
    });

    // 7. Return success
    return sendSuccess(
      res,
      201,
      { product },
      "Product draft created successfully."
    );
  } catch (error) {
    // Roll back uploaded images if the database operation fails.
    // uploadProductImages already handles its own partial failures.
    if (uploadedImages.length > 0) {
      const cleanupResults = await Promise.allSettled(
        uploadedImages.map((image) => deleteProductImage(image.public_id))
      );

      const cleanupFailures = cleanupResults.filter(
        (result) => result.status === "rejected"
      );

      if (cleanupFailures.length > 0) {
        console.error(
          "Failed to clean up some Cloudinary images:",
          cleanupFailures.map((result) => result.reason)
        );
      }
    }

    if (error.name === "ValidationError") {
      return sendError(
        res,
        400,
        Object.values(error.errors)
          .map((item) => item.message)
          .join(" ")
      );
    }

    if (error.name === "CastError") {
      return sendError(
        res,
        400,
        "An invalid identifier or field value was provided."
      );
    }

    return next(error);
  }
};


export const getSellerProducts = async (req, res, next) => {
  try {
    if (!req.userId) {
      return sendError(res, 401, "Authentication is required.");
    }

    const seller = await SellerProfile.findOne({
      user: req.userId,
    })
      .select("_id")
      .lean();

    if (!seller) {
      return sendError(
        res,
        403,
        "A seller profile is required to view products."
      );
    }

    const products = await Product.find({
      seller: seller._id,
    }).sort({ updatedAt: -1 });

    return sendSuccess(
      res,
      200,
      { products },
      "Seller products retrieved successfully."
    );
  } catch (error) {
    return next(error);
  }
};



