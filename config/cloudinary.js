require('dotenv').config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // PDFs are best uploaded as 'raw'
    format: async () => "pdf",
  },
});


const multer = require("multer");
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      const err = new Error('Only PDF files are allowed');
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  }
});

module.exports = { cloudinary, upload };
