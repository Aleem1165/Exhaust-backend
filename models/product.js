const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BrandSchema = new Schema({
    name: String,
    logo: String
})

const ProductSchema = new Schema({
    images: [{ type: String, }],
    brand: BrandSchema,
    description: String,
    name: String,
    price: Number,
    quantity: Number,
    sound: String,
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product