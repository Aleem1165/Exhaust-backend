const ShippingAddress = require("../models/shippingAddress")

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { addressId, address, city, state, zipCode, country, selected, userId, countryCode, number } = req.body
        if (!addressId) {
            return res.json({ success: false, message: '*Document _id required.' })
        }
        console.log(address, city, state, zipCode, country, selected, userId, countryCode, number, addressId);
        if (
            !address
            || !city
            || !state
            || !zipCode
            || !country
            || !userId
            || !countryCode
            || !number
        ) {
            return res.json({ success: false, message: '*All fields are required.' })
        }
        const updatedAddress = await ShippingAddress.findByIdAndUpdate(
            { _id: addressId },
            { address, city, state, zipCode, country, selected, userId, countryCode, number },
            { new: true }
        )
        return res.json({ success: true, message: 'Shipping address updated successfully.', updatedAddress })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}