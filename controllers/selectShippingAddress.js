const ShippingAddress = require("../models/shippingAddress");

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { docId } = req.body

        if (!docId) {
            return res.json({ success: false, message: '*Document _id required.' })
        }
        const setFalse = await ShippingAddress.updateMany(
            { userId: _id },
            { $set: { selected: false } }
        )
        const setTrue = await ShippingAddress.findOneAndUpdate(
            { _id: docId },
            { $set: { selected: true } },
            { returnDocument: 'after' }
        )
        return res.json({ success: true, message: 'Select shipping address' })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error: error.message });
    }
}