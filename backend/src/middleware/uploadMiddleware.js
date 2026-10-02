const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const uploadDirectory = path.join(__dirname, '../../uploads/products');

const extensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    fs.mkdir(uploadDirectory, { recursive: true }, (error) => callback(error, uploadDirectory));
  },
  filename: (_req, file, callback) => {
    const filename = `product-${Date.now()}-${crypto.randomUUID()}${extensions[file.mimetype]}`;
    callback(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!extensions[file.mimetype]) {
      const error = new Error('Only JPEG, PNG, and WebP images are allowed');
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = { upload };
