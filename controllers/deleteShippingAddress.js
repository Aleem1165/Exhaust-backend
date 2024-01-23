const ShippingAddress = require("../models/shippingAddress")
const User = require("../models/user")

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { addressId } = req.body
        if (!addressId) {
            return res.json({ success: false, message: '*Address _id is required.' })
        }

        const deletedAddress = await ShippingAddress.findByIdAndDelete({ _id: addressId })

        if (!deletedAddress) {
            return res.json({ success: false, message: '*Address not deleted.Try again later.' })
        }
        await User.findByIdAndUpdate(
            _id,
            { $pull: { shippingAddress: addressId } },
            { new: true }
        );

        return res.json({ success: true, message: 'Address delete successfully.' })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}