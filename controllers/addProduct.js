// images 
// brand
// description
// title
// price
// quantity {this product quantity}
// sound

const Product = require('../models/product')

module.exports = async (req, res, next) => {
    try {
        const { images, brand, description, name, price, quantity, sound } = req.body
        if (!images || !brand || !description || !name || !price || !quantity || !sound) {
            return res.json({ success: false, message: '*All fields required.' })
        }
        if (!Array.isArray(images) || images.length === 0) {
            return res.json({ success: false, message: 'At least one image required.' });
        }
        if (!brand.name || !brand.logo) {
            return res.json({ success: false, message: '*Brand name and brand logo required.' });
            // res.status().json({data , })
        }
        const newProduct = await Product.create({
            images,
            brand,
            description,
            name,
            price,
            quantity,
            sound
        })
        return res.json({ success: true, message: 'Add product successfully.', newProduct })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}