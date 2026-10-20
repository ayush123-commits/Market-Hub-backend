
import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true
    },

    altText: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    position: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    // Seller who proposed this product
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerProfile",
      required: true,
    },

    // Basic product information
    name: {
      type: String,
      trim: true,
      maxlength: 150,
      required: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      required: true
    },

    category: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true
    },

    brand: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    images: {
      type: [productImageSchema],
      default: [],
    },

    // Product-level specifications.
    // Variant-specific attributes belong in ProductSKU.
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Gate 1: Product moderation
    reviewStatus: {
      type: String,
      enum: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
      ],
      default: "draft",
      required: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    // ID of the admin who reviewed the product.
    // Add a ref when your admin model is established.
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    reviewNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Seller dashboard:
// Retrieve a seller's products by review status.
productSchema.index({
  seller: 1,
  reviewStatus: 1,
  updatedAt: -1,
});

// Admin moderation queue:
// Retrieve products awaiting review, oldest submission first.
productSchema.index({
  reviewStatus: 1,
  submittedAt: 1,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
