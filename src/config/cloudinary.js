import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnvVars.forEach((key) => {
  console.log(`${key}:`, process.env[key] ? "Loaded" : "Missing");
});

const missing = requiredEnvVars.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  throw new Error(`Missing or empty environment variable(s): ${missing.join(", ")}`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;