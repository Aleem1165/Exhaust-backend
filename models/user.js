const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    qty: Number
})

const CardSchema = { type: Schema.Types.ObjectId, ref: 'Card' }

const ShippingSchema = { type: Schema.Types.ObjectId, ref: 'ShippingAddress' }

const OrderSchema = { type: Schema.Types.ObjectId, ref: 'Order' }

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profile: String,
    countryCode: String,
    number: String,
    location: String,
    cart: [CartSchema],
    cards: [CardSchema],
    shippingAddress: [ShippingSchema],
    orders: [OrderSchema]
})

const User = mongoose.model('User', UserSchema)

module.exports = User