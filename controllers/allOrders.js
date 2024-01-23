const Order = require("../models/order");

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const allorder = await Order.find()
            .populate('userData', '-password -cards -shippingAddress -cart')
            .populate('products.product', '-quantity')
            .populate('shippingAddress');
        return res.json({ success: true, message: "All orders.", allorder })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}