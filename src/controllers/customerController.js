import User from '../models/auth/userModel.js'
import CustomerAddress from '../models/Adress/customerAddressModel.js'
import CustomerProfile from '../models/user&roles/customermodel.js';

import { sendError } from "../utils/responseHandling/errorHandling.js";
import { sendSuccess } from "../utils/responseHandling/successHandling.js";

export const getMyCustomerProfile = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId)
    if(!user){
     return  sendError(res, 404, "User not found")
    }
    const customerProfile = await CustomerProfile.findOne({
      user: userId
    })
    if(!customerProfile){
      return sendError(res, 404, "Customer profile not found, Create one")
    }

    const customer = {
      id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        phone: customerProfile.phone,
        avatar: customerProfile.avatar,
    } 
    
    return sendSuccess(res, 200, customer, "Customer profile fetched successFully")
  } catch (error) {
   return sendError(res, 500, `Internal server error ${error}`);
  }
}

export const createCustomerProfile = async (req, res) => {
  try {
    const userId = req.userId
    const {phone, avatar} = req.body
    const user = await User.findById(userId)
    if(!user){
     return  sendError(res, 404, "User not found")
    }
    const existingProfile = await CustomerProfile.findOne({
      user: userId,
    });

    if (existingProfile) {
      return sendError(
        res,
        409,
        "Customer profile already exists"
      );
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
    return sendError(
      res,
      500,
      "Internal server error"
    );
  }
}