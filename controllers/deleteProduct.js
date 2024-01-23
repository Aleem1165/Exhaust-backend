const Product = require("../models/product");

module.exports = async (req, res, next) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.json({ success: false, message: '*_id is required.' });
        }
        const deleteProduct = await Product.findByIdAndDelete({ _id })
        if (!deleteProduct) {
            return res.json({ success: false, message: '*Not deleted.Try again later.' });
        }
        return res.json({ success: true, message: 'Product delete successfully.' })
    } catch (error) {
        return res.json({ success: false, message: 'Internal server error', error: error.message });
    }
}