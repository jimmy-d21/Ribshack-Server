import { v2 as cloudinary } from "cloudinary";
import ENV from "../utils/ENV.js";

cloudinary.config({
  cloud_name: ENV.cloudinary.name,
  api_key: ENV.cloudinary.api_key,
  api_secret: ENV.cloudinary.secret_key,
});

export default cloudinary;
