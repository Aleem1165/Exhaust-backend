const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShippingSchema = new Schema({
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    selected: Boolean,
    userId: String,
    countryCode: String,
    number: String,
})

const ShippingAddress = mongoose.model('ShippingAddress', ShippingSchema)

module.exports = ShippingAddress