import Product from "../../models/product/productModel.js";
import SellerProfile from "../../models/user&roles/sellerModel.js";
import { sendError } from "../../utils/responseHandling/errorHandling.js";
import { sendSuccess } from "../../utils/responseHandling/successHandling.js";


export const createProductDraft = async (req, res, next) => {
  try {
    // 1. Verify authentication
    if (!req.userId) {
      return sendError(res, 401, "Authentication is required.");
    }

    // 2. Find the seller profile
    const seller = await SellerProfile.findOne({
      user: req.userId,
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
    const {
      name,
      description,
      category,
      brand,
      images,
      attributes,
    } = req.body ?? {};

    // 4. Validate request fields
    const errors = {};

    // Validate product name
    if (
      name === undefined ||
      name === null ||
      name === ""
    ) {
      errors.name = "Product name is required.";
    } else if (typeof name !== "string") {
      errors.name = "Product name must be a string.";
    } else if (!name.trim()) {
      errors.name = "Product name is required.";
    } else if (name.trim().length > 150) {
      errors.name =
        "Product name must be 150 characters or fewer.";
    }

    // Validate product description
    if (
      description === undefined ||
      description === null ||
      description === ""
    ) {
      errors.description =
        "Product description is required.";
    } else if (typeof description !== "string") {
      errors.description =
        "Product description must be a string.";
    } else if (!description.trim()) {
      errors.description =
        "Product description is required.";
    } else if (description.trim().length > 5000) {
      errors.description =
        "Description must be 5000 characters or fewer.";
    }

    // Validate product category
    if (
      category === undefined ||
      category === null ||
      category === ""
    ) {
      errors.category = "Product category is required.";
    } else if (typeof category !== "string") {
      errors.category =
        "Product category must be a string.";
    } else if (!category.trim()) {
      errors.category = "Product category is required.";
    } else if (category.trim().length > 100) {
      errors.category =
        "Category must be 100 characters or fewer.";
    }

    // Validate optional brand
    if (brand != null && typeof brand !== "string") {
      errors.brand = "Brand must be a string.";
    } else if (
      typeof brand === "string" &&
      brand.trim().length > 100
    ) {
      errors.brand =
        "Brand must be 100 characters or fewer.";
    }

    // Validate optional images
    const productImages = images ?? [];

    if (!Array.isArray(productImages)) {
      errors.images = "Images must be an array.";
    } else if (productImages.length > 10) {
      errors.images =
        "A product can have at most 10 images.";
    }

    // Validate optional attributes
    if (
      attributes !== undefined &&
      (
        attributes === null ||
        typeof attributes !== "object" ||
        Array.isArray(attributes)
      )
    ) {
      errors.attributes = "Attributes must be an object.";
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return sendError(
        res,
        400,
        Object.values(errors).join(" ")
      );
    }

    // 5. Create the product draft
    const product = await Product.create({
      seller: seller._id,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      brand:
        typeof brand === "string" && brand.trim()
          ? brand.trim()
          : undefined,
      images: productImages,
      attributes: attributes ?? {},
      reviewStatus: "draft",
    });

    // 6. Send success response
    return sendSuccess(
      res,
      201,
      { product },
      "Product draft created successfully."
    );
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return sendError(
        res,
        400,
        Object.values(error.errors)
          .map((item) => item.message)
          .join(" ")
      );
    }

    // Handle invalid values and identifiers
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


