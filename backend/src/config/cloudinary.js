const cloudinary = require('cloudinary').v2;
const fs = require('fs');

function isCloudinaryConfigured() {
  if (process.env.CLOUDINARY_URL) return true;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
  return Boolean(cloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
    return true;
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return true;
  }
  return false;
}

async function uploadToCloudinary(filePath, folder = 'marketsignal/products') {
  if (!configureCloudinary()) {
    throw new Error('Cloudinary credentials are not configured');
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });

  // Attempt to clean up temporary local file
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Non-fatal if temporary file cannot be immediately deleted
  }

  return result.secure_url;
}

module.exports = {
  isCloudinaryConfigured,
  uploadToCloudinary,
};
