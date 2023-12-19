const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  owner: {
    // type: Schema.ObjectId,
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    default: 0
  },
  totalRatingCount: {
    type: Number,
    default: 0
  },
  totalRating: {
    type: Number,
    default: 0
  },
  description: String,
  specifications: [String],
  categories: {
    type: [String],
    required: true
  },
  customizations: [{
    name: String,
    options: [String],
  }],
  images: [String],
  deal: {
    newprice: Number
  }

})

module.exports = mongoose.model('product', productSchema)
