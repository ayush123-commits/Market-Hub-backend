
import cloudinary from "../config/cloudinary.js";
import { existsSync } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";

const imagePath = path.join(homedir(), "Desktop", "test.webp")

if (!imagePath) {
  console.error(
    "Usage: node src/scripts/testCloudinaryUpload.js <image-path>"
  );
  process.exitCode = 1;
} else {
  const absolutePath = path.resolve(imagePath);

  if (!existsSync(absolutePath)) {
    console.error("Image file not found:", absolutePath);
    process.exitCode = 1;
  } else {
    try {
      const result = await cloudinary.uploader.upload(
        absolutePath,
        {
          folder: "market-hub-tests",
          resource_type: "image",
        }
      );

      console.log("\nUpload successful!");
      console.log("Public ID:", result.public_id);
      console.log("Secure URL:", result.secure_url);
      console.log("Format:", result.format);
      console.log("Dimensions:", `${result.width} x ${result.height}`);
      console.log("File size:", result.bytes, "bytes");
      console.log("Resource type:", result.resource_type);
    } catch (error) {
      console.error("Image upload failed:", error.message);
      process.exitCode = 1;
    }
  }
}

