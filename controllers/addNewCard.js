const mongoose = require("mongoose");
const Card = require("../models/card");
const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const _id = req._id;
        const { name, cardNumber, expireDate, cvv  } = req.body;

        if (!name || !cardNumber || !expireDate || !cvv) {
            return res.json({ success: false, message: '*All fields are required.' });
        }

        const cardNumberPattern = /^[0-9]{16}$/;
        if (!cardNumberPattern.test(cardNumber)) {
            return res.json({ success: false, message: '*Invalid card number.' });
        }

        const newCard = await Card.create({
            name,
            cardNumber,
            expireDate,
            cvv,
            selected: false,
            userId: _id
        });

        const newCardId = new mongoose.Types.ObjectId(newCard._id);

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { $push: { cards: newCardId } },
            { new: true }
        );

        return res.json({ success: true, message: 'New card added successfully.' , newCard });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: '*Server issue, try again later.', error });
    }
};