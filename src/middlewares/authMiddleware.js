import User from "../models/auth/userModel.js";
import { sendError } from "../utils/responseHandling/errorHandling.js";
import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next)=>{
  try {
  const token = req.cookies.accessToken;
     if (!token) {
  return sendError(res, 401, "Authentication required");
  }
  const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);
const userId = decoded.sub;
const user = await User.findById(userId);
if (!user) {
  return sendError(res, 401, "User no longer exists");
}
req.userId = userId;
req.role = user.role;
next();
  } catch (error) {
    console.error(error);

    return sendError(
      res,
      401,
      "Invalid or expired authentication token"
    );
  }
}

export default authMiddleware 