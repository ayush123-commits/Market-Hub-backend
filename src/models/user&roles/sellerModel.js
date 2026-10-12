import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema({
  user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
      unique: true,
      index: true,
    },
    displayName : {
      type:String,
      required : true,
      trim : true,
      maxlength : 80
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    logo: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "active", "suspended"],
      default: "draft",
    },
  },
  { timestamps: true }
)

export default mongoose.model(
  "SellerProfile",
  sellerProfileSchema
);