const User = require("../models/user")

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { cartId } = req.body
        if (!cartId) {
            return res.json({ success: false, message: 'Card _id required.' })
        }
        const deleteCart = await User.findByIdAndUpdate(
            _id,
            { $pull: { cart: { _id: cartId } } },
            { new: true }
        )
        return res.json({ success: true, message: 'Delete from cart.' })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}