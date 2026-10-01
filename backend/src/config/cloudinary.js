const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const buffer = file?.buffer;
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      const error = new Error('Uploaded image buffer is missing');
      error.statusCode = 400;
      return reject(error);
    }

    const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
      .filter((name) => !process.env[name]);
    if (missing.length) {
      console.error('[Cloudinary] Missing configuration:', missing.join(', '));
      const error = new Error('Cloudinary is not configured');
      error.statusCode = 503;
      return reject(error);
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'marketsignal/products', resource_type: 'image' },
      (error, result) => {
        if (error || !result?.secure_url) {
          console.error('[Cloudinary] Upload failed:', error?.message || 'No secure URL returned');
          const uploadError = new Error('Image upload failed');
          uploadError.statusCode = 502;
          return reject(uploadError);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { uploadImage };
