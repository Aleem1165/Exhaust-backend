const Admin = require('../models/admin')
module.exports = async (req, res, next) => {
    try {
        const { name, profile } = req.body
        const _id = req._id;
        const updatedData = await Admin.findByIdAndUpdate(
            { _id },
            { name, profile },
            { new: true }
        )
        return res.json({ success: true, message: 'Admin profile updated.', updatedData })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue try again later.', error })
    }
}