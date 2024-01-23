const mongoose = require("mongoose")
const ShippingAddress = require("../models/shippingAddress")
const User = require("../models/user")

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { address, city, state, zipCode, country , countryCode , number } = req.body
        if (!address || !city || !state || !zipCode || !country || !countryCode || !number) {
            return res.json({ success: false, message: '*All fields are required.' })
        }

        const newAddress = await ShippingAddress.create({
            address,
            city,
            state,
            zipCode,
            country,
            selected:false,
            userId:_id,
            countryCode,
            number
        })

        const newAddressId = new mongoose.Types.ObjectId(newAddress._id)

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $push: { shippingAddress: newAddressId } },
            { new: true }
        )
        
        return res.json({ success: true, message: 'New address added successfully.' , newAddress })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}