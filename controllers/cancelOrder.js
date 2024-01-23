const Order = require("../models/order")

module.exports = async (req, res, nexx) => {
    try {
        const _id = req._id
        const { orderId } = req.body
        if (!orderId) {
            return res.json({ success: false, message: '*Order _id required.' })
        }
        const existingOrder = await Order.findById(orderId)
        if (!existingOrder) {
            return res.json({ success: false, message: '*Order not found.Check your order _id and try again.' })
        }
        const previousStatus = existingOrder.status
        if (previousStatus !== "Processing") {
            return res.json({ success: false, message: "*You cannot cancel your order because it's already dispached." })
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            { _id: orderId },
            { status: 'Canceled' },
            { new: true }
        )
        return res.json({ success: false, message: '*Your order has been canceled.' })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}