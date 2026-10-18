import multer from "multer";
import path from "node:path";
import { homedir } from "node:os";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";

// Save uploaded files to a folder on your Desktop.
const uploadDir = path.join(
  homedir(),
  "Desktop",
  "product-photos"
);

mkdirSync(uploadDir, { recursive: true });

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

// This is the important change.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extensionByMime = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/avif": ".avif",
    };

    const extension =
      extensionByMime[file.mimetype] || "";

    cb(null, `${randomUUID()}${extension}`);
  },
});

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