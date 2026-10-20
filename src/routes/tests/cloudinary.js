import { uploadProductImages
 } from "../../services/cloudinary/cloudinary.service.js";

export const testCloudinary = async (req, res, next) => {
  try {
    // Text fields from Postman's form-data
    const { name, price, category, description } = req.body ?? {};

    // Images received through Multer
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image using the photos field.",
      });
    }

    // Upload images to Cloudinary
    const images = await uploadProductImages(files);

    return res.status(201).json({
      success: true,
      message: "Cloudinary test upload successful.",
      data: {
        name,
        price,
        category,
        description,
        images,
      },
    });
  } catch (error) {
    next(error);
  }
};