const mongoose = require("mongoose")
const User = require("../models/user")

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { productId, qty } = req.body;

        if (!productId || !qty) {
            return res.json({ success: false, message: '*Product _id and quantity required.' });
        }

        const existingUser = await User.findById(_id);

        if (!existingUser) {
            return res.json({ success: false, message: '*User not found.' });
        }

        const existingCartItem = existingUser.cart.find(item => item.product.equals(productId));

        if (existingCartItem) {
            // If the product is already in the cart, update the quantity
            const updatedQty = existingCartItem.qty + qty;

            const updateCart = await User.updateOne(
                { _id, 'cart.product': productId },
                { $set: { 'cart.$.qty': updatedQty } }
            );

            return res.json({ success: true, message: 'Quantity has been increased.' });
        } else {
            // If the product is not in the cart, add it as a new item
            const cartItem = {
                product: new mongoose.Types.ObjectId(productId),
                qty
            };

            const addToCart = await User.findByIdAndUpdate(
                _id,
                { $push: { cart: cartItem } },
                { new: true }
            ).populate({
                path: 'cart.product',
                select: '-quantity' // Exclude the 'quantity' field from the product
            });
            // .populate('cart.product');
               const addedCartItem = addToCart.cart[addToCart.cart.length - 1];
            return res.json({ success: true, message: 'Add product in cart successfully.' , cartItem: addedCartItem  });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
};