const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const _id = req._id;
        const { cartId } = req.body;

        if (!cartId) {
            return res.json({ success: false, message: '*cart _id required.' });
        }

        const updateUser = await User.findOneAndUpdate(
            { _id, 'cart._id': cartId },
            { $inc: { 'cart.$.qty': -1 } }, 
            { new: true }
        );

        if (!updateUser) {
            return res.json({ success: false, message: 'Some error, try again later.' });
        }

        return res.json({ success: true, message: 'Cart decremented.' });
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
};
