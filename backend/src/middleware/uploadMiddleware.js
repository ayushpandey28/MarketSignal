const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      const error = new Error('Only JPEG, PNG, and WebP images are allowed');
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = { upload };
