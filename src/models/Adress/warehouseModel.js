import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  seller : {
    type : mongoose.Schema.Types.ObjectId,
    ref: "SellerProfile",
      required: true,
      index: true,
  },
  name : {
    type: String,
      required: true,
      trim: true,
      maxlength: 100,
  },
    address: {
        type: String,
        required: true,
        trim: true,
      },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;