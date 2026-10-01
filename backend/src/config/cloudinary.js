const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'marketsignal/products', resource_type: 'image' },
      (error, result) => {
        if (error || !result?.secure_url) {
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
