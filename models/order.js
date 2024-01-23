const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductsSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    qty: Number
})

const OrderSchema = new Schema({
    userData: { type: Schema.Types.ObjectId, ref: "User" },
    products: [ProductsSchema],
    shippingAddress: { type: Schema.Types.ObjectId, ref: "ShippingAddress" },
    status: String,
    paymentMethod: String,
    createdAt: { type: Date, default: Date.now }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order