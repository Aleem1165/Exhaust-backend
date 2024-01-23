const Order = require("../models/order")
const User = require("../models/user")

module.exports = async (req, res, next) => {
    try {
        const { orderId, status } = req.body
        if (!orderId) {
            return res.json({ success: false, message: '*Document _id required.' })
        }
        if (!status) {
            return res.json({ success: false, message: '*Status not be empty.' })
        }
        if (status === "Delivered") {
            const existingOrder = await Order.findById(orderId)
            const previousStatus = existingOrder.status
            if (previousStatus === 'Delivered') {
                return res.json({ success: false, message: "*Order Delivered. No further updates allowed." })
            }
            const updatedOrder = await Order.findByIdAndUpdate(
                { _id: orderId },
                { status },
                { new: true }
            )
            const userId = existingOrder.userData
            const userData = await User.findByIdAndUpdate(
                userId,
                { $pull: { orders: orderId } },
                { new: true }
            );
            return res.json({ success: true, message: 'Order status successfully.' })
        } else {
            const existingOrder = await Order.findById(orderId)
            const previousStatus = existingOrder.status
            if (previousStatus === 'Delivered') {
                return res.json({ success: false, message: "*Order Delivered. No further updates allowed." })
            }
            const updatedOrder = await Order.findByIdAndUpdate(
                { _id: orderId },
                { status },
                { new: true }
            )
            return res.json({ success: true, message: 'Order status successfully.' })
        }
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}