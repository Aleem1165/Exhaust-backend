const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const { name, location, profile, countryCode, number } = req.body
        const _id = req._id;
        if (!name || !location || !profile || !countryCode || !number) {
            return res.json({ success: false, message: '*All field required.', })
        }
        const updatedData = await User.findByIdAndUpdate(
            { _id },
            { name, location, profile, number, countryCode },
            { new: true }
        )
        const userData = {
            name: updatedData.name,
            profile: updatedData.profile,
            location: updatedData.location,
            countryCode: updatedData.countryCode,
            number: updatedData.number
        }
        return res.json({ success: true, message: 'Profile update successfully.', userData })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}