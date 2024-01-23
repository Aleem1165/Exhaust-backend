const Card = require("../models/card")

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { docId } = req.body

        if (!docId) {
            return res.json({ success: false, message: '*Document _id required.' })
        }
        const setFalse = await Card.updateMany(
            { userId: _id },
            { $set: { selected: false } }
        )
        const setTrue = await Card.findOneAndUpdate(
            { _id: docId },
            { $set: { selected: true } },
            { returnDocument: 'after' }
        )
        return res.json({ success: true, message: 'Payment card selected.' })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error: error.message });
    }
}
