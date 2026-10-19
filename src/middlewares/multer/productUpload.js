import multer from "multer";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    const err = new Error(
      "Only JPEG, PNG, WebP and AVIF images are allowed."
    );

    err.code = "INVALID_FILE_TYPE";
    return cb(err);
  }

  cb(null, true);
};

const storage = multer.memoryStorage();

const productImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
    fields: 30,
    parts: 40,
    fieldSize: 16 * 1024,
  },
});

export const uploadProductPhotos =
  productImageUpload.array("photos", 10);
