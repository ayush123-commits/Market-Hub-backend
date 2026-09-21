import { sendError } from "../utils/responseHandling/errorHandling.js";

const roleAuthorise = (requiredRole) => {
  return (req, res, next) => {
    if (!req.role) {
      return sendError(
        res,
        401,
        "Authentication required"
      );
    }

    if (req.role !== requiredRole) {
      return sendError(
        res,
        403,
        "You are not authorized for this role"
      );
    }

    next();
  };
};

export default roleAuthorise;