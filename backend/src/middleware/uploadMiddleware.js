const multer = require('multer');

const extensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    if (!extensions[file.mimetype]) {
      const error = new Error(
        'Only JPEG, PNG, and WebP images are allowed'
      );

      error.statusCode = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

module.exports = {
  upload,
};