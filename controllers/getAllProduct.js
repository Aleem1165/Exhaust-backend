const Product = require('../models/product');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        if (req.data) {
            const { userData, token } = req.data;
            const products = await Product.find();

            if (!userData || !token) {
                return res.json({ success: true, message: 'All products.', products });
            } else {
                const populatedUserData = await User.findById(userData._id)
                    .populate('cart.product')
                    .populate('cards')
                    .populate('shippingAddress')
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
                userData.cart = populatedUserData.cart;
                userData.cards = populatedUserData.cards;
                userData.shippingAddress = populatedUserData.shippingAddress;
                userData.orders = populatedUserData.orders;
                return res.json({ success: true, message: 'All products.', products, userData, token });
            }
        } else {
            const products = await Product.find();
            return res.json({ success: true, message: 'All products.', products });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: '*Server issue try again later.', error: error.message });
    }
}