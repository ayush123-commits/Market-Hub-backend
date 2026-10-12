import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleAuthorise from "../middlewares/authoriseMiddleware.js";
import { switchToSeller } from "../controllers/accountController";
import { switchToCustomer } from "../controllers/accountController";

const router = express.Router();

router.post("/switch-to-seller",authMiddleware, roleAuthorise("CUSTOMER"), switchToSeller);

router.post("/switch-to-customer",authMiddleware, roleAuthorise("SELLER"), switchToCustomer);

export default router;