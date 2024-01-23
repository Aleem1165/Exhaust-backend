const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const maxFileLimit = 11;
const cloud_name = process.env.CLOUDINARY_NAME;
const api_key = process.env.CLOUDINARY_KEY;
const api_secret = process.env.CLOUDINARY_SECRET;
const cloudinary_folder = 'Exhaust/Product';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (req.files && req.files.length >= maxFileLimit) {
        return cb(new Error('Exceeded maximum image upload limit.'));
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
});

module.exports = (req, res, next) => {
    try {
        upload.array('images', maxFileLimit)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.error(err);
                return res.status(400).json({ success: false, message: 'Multer error', error: err.message });
            } else if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
            }

            if (req.fileValidationError) {
                return res.status(400).json({ success: false, message: req.fileValidationError });
            }

            if (!req.files || req.files.length === 0) {
                return res.json({ success: false, message: '*Images required.' });
            }

            const uploadPromises = req.files.map((uploadedFile) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(
                        `data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString('base64')}`,
                        {
                            resource_type: 'auto',
                            folder: cloudinary_folder,
                        },
                        (cloudinaryErr, cloudinaryResult) => {
                            if (cloudinaryErr) {
                                console.error(cloudinaryErr);
                                reject({ success: false, message: 'Cloudinary error', error: cloudinaryErr.message });
                            } else {
                                resolve(cloudinaryResult.secure_url);
                            }
                        }
                    );
                });
            });

            Promise.all(uploadPromises)
                .then((results) => {
                    return res.json({
                        success: true,
                        message: 'Images uploaded successfully.',
                        images: results,
                    });
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
                });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};




