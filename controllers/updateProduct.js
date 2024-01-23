const Product = require("../models/product");

module.exports = async (req, res, next) => {
    try {
        const { _id, images, brand, description, name, price, quantity, sound } = req.body
        if (!_id) {
            return res.json({ success: false, message: '_id is required.' });
        }
        if (!images || !brand || !description || !name || !price || !quantity || !sound) {
            return res.json({ success: false, message: '*All fields are required.' })
        }
        if (!Array.isArray(images) || images.length === 0) {
            return res.json({ success: false, message: 'At least one image required.' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            { _id },
            { images, brand, description, name, price, quantity, sound },
            { new: true }
        )
        return res.json({ success: true, message: 'update product.' , updatedProduct })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}