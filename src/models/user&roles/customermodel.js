import mongoose from "mongoose";

const customerProfileSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required: true,
    unique: true,
    index: true,
  },
  
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    }
  
},{timestamps: true})


const CustomerProfile = mongoose.model("CustomerProfile" , customerProfileSchema)

export default CustomerProfile