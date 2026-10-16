import mongoose from "mongoose";

const weightSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["g", "kg", "lb", "oz"],
      default: "g",
    },
  },
  {
    _id: false,
  }
);

const dimensionsSchema = new mongoose.Schema(
  {
    length: {
      type: Number,
      min: 0,
    },

    width: {
      type: Number,
      min: 0,
    },

    height: {
      type: Number,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["mm", "cm", "m", "in"],
      default: "cm",
    },
  },
  {
    _id: false,
  }
);

const productSKUSchema = new mongoose.Schema(
  {
    // Parent product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Stock Keeping Unit code
    // Unique within its parent product
    skuCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 1,
      maxlength: 80,
    },

    // Variant-specific attributes
    // Examples: size, color, storage capacity
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Proposed selling price in the currency's
    // smallest units. Example: INR 129900 = ₹1,299.00.
    priceAmountMinorUnits: {
      type: Number,
      min: 0,
      validate: {
        validator: (value) =>
          value == null || Number.isSafeInteger(value),
        message: "Price must be a whole number of minor currency units.",
      },
    },

    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "INR",
      match: /^[A-Z]{3}$/,
    },

    // Optional physical specifications
    weight: {
      type: weightSchema,
      default: undefined,
    },

    dimensions: {
      type: dimensionsSchema,
      default: undefined,
    },

    // Optional product barcode
    barcode: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Gate 2: Publication
    // Product approval does not automatically publish a SKU.
    publicationStatus: {
      type: String,
      enum: ["unpublished", "published"],
      default: "unpublished",
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    // Admin or authorized actor who published the SKU
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate SKU codes within the same product
productSKUSchema.index(
  {
    product: 1,
    skuCode: 1,
  },
  {
    unique: true,
  }
);

// Retrieve a product's variants by publication status
productSKUSchema.index({
  product: 1,
  publicationStatus: 1,
});

// Public catalog: all published SKUs, newest first.
// Partial index — only published docs are indexed.
productSKUSchema.index(
  { publicationStatus: 1, publishedAt: -1 },
  { partialFilterExpression: { publicationStatus: "published" } }
);

// Barcode lookup — unique when present.
// Skips SKUs without a barcode entirely.
productSKUSchema.index(
  { barcode: 1 },
  {
    unique: true,
    partialFilterExpression: { barcode: { $type: "string" } },
  }
);

const ProductSKU = mongoose.model(
  "ProductSKU",
  productSKUSchema
);

export default ProductSKU;