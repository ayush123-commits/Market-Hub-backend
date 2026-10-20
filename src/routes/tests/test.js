import express from 'express'
import { testCloudinary } from './cloudinary.js';
import {uploadProductImages} from '../../middlewares/multer/productUpload.js'

const router = express.Router();

router.post('/cloudinary', uploadProductImages,testCloudinary);

export default router;