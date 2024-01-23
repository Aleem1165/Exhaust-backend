const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloud_name = process.env.CLOUDINARY_NAME;
const api_key = process.env.CLOUDINARY_KEY;
const api_secret = process.env.CLOUDINARY_SECRET;
const cloudinary_folder = 'Exhaust/Profile';

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
});

module.exports = (req, res, next) => {
    try {
        upload.single('image')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.error(err);
                return res.status(400).json({ success: false, message: 'Multer error', error: err.message });
            } else if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            }

            if (!req.file) {
                return res.json({ success: false, message: '*image required.' });
            }

            const uploadedFile = req.file;
            cloudinary.uploader.upload(
                `data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString('base64')}`,
                {
                    resource_type: 'auto',
                    folder: cloudinary_folder,
                },
                (cloudinaryErr, cloudinaryResult) => {
                    if (cloudinaryErr) {
                        console.error(cloudinaryErr);
                        return res.status(500).json({ success: false, message: 'Cloudinary error', error: cloudinaryErr.message });
                    }

                    return res.json({ success: true, message: 'Image uploaded successfully', url: cloudinaryResult.secure_url });
                }
            );
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


