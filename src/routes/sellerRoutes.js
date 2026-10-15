import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleAuthorise from "../middlewares/authoriseMiddleware.js";
import {
  createSellerProfile,
  getMySellerProfile,
  updateSellerProfile,
} from "../controllers/sellerController.js";
import { createWarehouse, deleteWarehouse, getWarehouseById, getWarehouses, updateWarehouse } from "../controllers/wareHouseController.js";

const router = express.Router();

// Create seller profile before switching to seller mode
router.post(
  "/profile",
  authMiddleware,
  roleAuthorise("CUSTOMER"),
  createSellerProfile
);

// Get your own seller profile
router.get(
  "/profile",
  authMiddleware,
  roleAuthorise("SELLER"),
  getMySellerProfile
);

// // Update your seller profile while in seller mode
router.patch(
  "/profile",
  authMiddleware,
  roleAuthorise("SELLER"),
  updateSellerProfile
);

router.post('/warehouse',authMiddleware,
  roleAuthorise("SELLER"), createWarehouse)
router.get('/warehouses',authMiddleware,
  roleAuthorise("SELLER"), getWarehouses)
router.get('/warehouse/:id',authMiddleware,
  roleAuthorise("SELLER"), getWarehouseById)
router.patch('/warehouse/:id',authMiddleware,
  roleAuthorise("SELLER"), updateWarehouse)
router.delete('/warehouse/:id',authMiddleware,
  roleAuthorise("SELLER"), deleteWarehouse)



export default router;
