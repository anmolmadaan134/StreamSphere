const cloudinary = require('cloudinary').v2;
const fs = require('fs');

require('dotenv').config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload video to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  try {
    // Upload video
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: folder,
      use_filename: true,
      unique_filename: true
    });

    // Remove local file after upload
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

// Generate video thumbnail
const generateThumbnail = async (videoPublicId) => {
  try {
    const thumbnailUrl = cloudinary.url(videoPublicId, {
      resource_type: 'video',
      transformation: [
        { width: 320, crop: 'scale', aspect_ratio: '16:9' },
        { start_offset: 'duration/2', crop: 'fill' }
      ]
    });

    return thumbnailUrl;
  } catch (error) {
    console.error('Thumbnail Generation Error:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  generateThumbnail
};