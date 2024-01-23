const Card = require("../models/card")
const User = require("../models/user")

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { cardId } = req.body

        if (!cardId) {
            return res.json({ success: false, message: '*Card _id required.' })
        }

        const deleteCard = await Card.findByIdAndDelete({ _id: cardId })
        if (!deleteCard) {
            return res.json({ success: false, message: '*Card not deleted.Try again later.' })
        }
        await User.findByIdAndUpdate(
            _id,
            { $pull: { cards: cardId } },
            { new: true }
        );
        return res.json({ success: true, message: "Card deleted successfully." })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}   