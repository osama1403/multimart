const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ratingSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  productId: {
    type: Schema.ObjectId,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('rating', ratingSchema)