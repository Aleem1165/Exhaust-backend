const User = require('../models/user')

module.exports = async (req, res, next) => {
    try {
        const _id = req._id;
        const userData = await User.findOne({ _id })
            .populate('cart.product')
            .populate({ path: 'cards', model: 'Card' })
            .populate({ path: 'shippingAddress', model: 'ShippingAddress' })
            .populate({
                path: 'orders',
                model: 'Order',
                select: '-userData',
                populate: [
                    {
                        path: 'products.product',
                        model: 'Product',
                        select: '-quantity'
                    },
                    {
                        path: 'shippingAddress',
                        model: 'ShippingAddress'
                    }
                ]
            })
        return res.json({ success: true, message: 'User details.', userData })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}