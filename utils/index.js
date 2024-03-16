const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});
// Configure Multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "images", // Folder to upload files to in Cloudinary
        allowed_formats: ["jpg", "jpeg"] // Allowed file formats
    }
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;