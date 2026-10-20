
import cloudinary from "../../config/cloudinary.js";

const PRODUCT_IMAGES_FOLDER = "products";

// /**
//  * Upload a Multer memoryStorage file buffer to Cloudinary.
//  * @param {Buffer} buffer
//  * @param {object} options
//  * @returns {Promise<object>}
//  */
const uploadBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return reject(new Error("A valid, non-empty image buffer is required."));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: PRODUCT_IMAGES_FOLDER,
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary returned no upload result."));
        }

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.on("error", reject);
    uploadStream.end(buffer);
  });
};

// /**
//  * Upload one Multer file.
//  * @param {Express.Multer.File} file
//  */
export const uploadProductImage = async (file) => {
  if (!file?.buffer) {
    throw new Error("No valid product image file provided.");
  }

  return uploadBuffer(file.buffer);
};

// /**
//  * Upload multiple Multer files.
//  * @param {Express.Multer.File[]} files
//  */
export const uploadProductImages = async (files = []) => {
  if (!Array.isArray(files)) {
    throw new TypeError("Product images must be provided as an array.");
  }

  if (files.length === 0) {
    return [];
  }

  const uploadedImages = await Promise.allSettled(
    files.map((file) => uploadProductImage(file))
  );

  const successfulUploads = uploadedImages
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const failedUpload = uploadedImages.find(
    (result) => result.status === "rejected"
  );

  if (failedUpload) {
    // Remove images that uploaded successfully if another upload failed.
    await Promise.allSettled(
      successfulUploads.map((image) =>
        deleteProductImage(image.public_id)
      )
    );

    throw failedUpload.reason;
  }

  return successfulUploads;
};

// /**
//  * Delete a product image from Cloudinary.
//  * @param {string} publicId
//  */
export const deleteProductImage = async (publicId) => {
  if (!publicId || typeof publicId !== "string") {
    throw new Error("A valid Cloudinary public ID is required.");
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(
      `Failed to delete Cloudinary image: ${publicId}`
    );
  }

  return result;
};
