import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleAuthorise from "../middlewares/authoriseMiddleware.js";
import {
  createCustomerAddress,
  createCustomerProfile,
  deleteCustomerAddress,
  getCustomerAddress,
  getCustomerAddresses,
  getMyCustomerProfile,
  setDefaultCustomerAddress,
  updateCustomerAddress,
  updateCustomerProfile,
} from "../controllers/customerController.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  getMyCustomerProfile
);

router.patch(
  "/me",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  updateCustomerProfile
);

router.post(
  "/createProfile",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  createCustomerProfile
);


router.post(
  "/me/addresses",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  createCustomerAddress
);

router.get(
  "/me/addresses",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  getCustomerAddresses
);

router.get(
  "/me/addresses/:addressId",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  getCustomerAddress
);

router.patch(
  "/me/addresses/:addressId",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  updateCustomerAddress
);

router.delete(
  "/me/addresses/:addressId",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  deleteCustomerAddress
);

router.patch(
  "/me/addresses/:addressId/default",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  setDefaultCustomerAddress
);

export default router;
