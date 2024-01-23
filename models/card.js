const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema({
    name: String,
    cardNumber: Number,
    expireDate: String,
    cvv: Number,
    selected: Boolean,
    userId: String
})

const Card = mongoose.model('Card', CardSchema)

module.exports = Card