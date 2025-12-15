const cloudinary = require("cloudinary").v2;
const fs = require('fs'); // Node.js built-in module for file system operations
require("dotenv").config();


exports.connectCloudinary = () => {

    cloudinary.config({
        secure: true
    });
    console.log("Cloudinary connected successfully.");
}