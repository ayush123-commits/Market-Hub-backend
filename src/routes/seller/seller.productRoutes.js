import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js'
import roleAuthorise from '../../middlewares/authoriseMiddleware.js';
import { createProductDraft } from '../../controllers/seller/seller.productController.js';
import { uploadProductImages } from '../../middlewares/multer/productUpload.js';
const router = express.Router();

// POST	/api/seller/products	Create a product draft

router.post(
  "/",
  authMiddleware,
  roleAuthorise("SELLER"),
  uploadProductImages,
  createProductDraft
);

// GET	/api/seller/products	Retrieve the seller's products
// GET	/api/seller/products/:productId	Retrieve one product and its SKUs
// PATCH	/api/seller/products/:productId	Update an eligible draft
// POST	/api/seller/products/:productId/skus	Add a SKU and proposed price
// PATCH	/api/seller/products/:productId/skus/:skuId	Update an eligible SKU
// POST	/api/seller/products/:productId/submit	Submit the product and its SKUs for review

export default router;