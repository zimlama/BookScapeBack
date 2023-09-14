// import { v2 as cloudinary } from "cloudinary";
const cloudinary = require("cloudinary").v2;
// import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRECT,
  secure: true,
});

module.exports = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file);
    return res.secure_url;
  } catch (error) {
    return error;
  }
};
