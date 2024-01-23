const Card = require("../models/card");

module.exports = async (req, res, next) => {
    try {
        const _id = req._id
        const { cardId, name, cardNumber, expireDate, cvv, selected, userId } = req.body
        if (!cardId) {
            return res.json({ success: false, message: '*Document _id required.' })
        }
        if (!name || !cardNumber || !expireDate || !cvv) {
            return res.json({ success: false, message: '*All fields are required.' });
        }
        const cardNumberPattern = /^[0-9]{16}$/;
        if (!cardNumberPattern.test(cardNumber)) {
            return res.json({ success: false, message: '*Invalid card number.' });
        }
        const updatedCard = await Card.findByIdAndUpdate(
            { _id: cardId },
            { name, cardNumber, expireDate, cvv, selected, userId },
            { new: true }
        )
        return res.json({ success: true, message: 'Card updated successfully.' , updatedCard })
    } catch (error) {
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
}