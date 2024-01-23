// user data mongoose object id 
// products [{mongooose object id , qty}] 
// shipping address mongoose object id 

const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { products, shippingAddress, status, paymentMethod } = req.body
        if (!products || !shippingAddress || !status || !paymentMethod) {
            return res.json({ success: false, message: '*All fields are required.' })
        }
        const userDataId = new mongoose.Types.ObjectId(_id)
        const shippingAddressId = new mongoose.Types.ObjectId(shippingAddress)
        const convertedProducts = products.map(({ product, qty }) => ({
            product: new mongoose.Types.ObjectId(product),
            qty: qty
        }));

        const newOrder = await Order.create({
            userData: userDataId,
            products: convertedProducts,
            shippingAddress: shippingAddressId,
            status,
            paymentMethod
        })

        const populatedProducts = await Order.populate(newOrder, { path: 'products.product', select: '-quantity' });

        const populatedOrder = await Order.populate(populatedProducts, { path: 'shippingAddress' });

        const newOrderId = new mongoose.Types.ObjectId(newOrder._id);
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $push: { orders: newOrderId }, $set: { cart: [] } },
            { new: true }
        );

        return res.json({ success: true, message: 'Order confirmed.', newOrder: populatedOrder })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}