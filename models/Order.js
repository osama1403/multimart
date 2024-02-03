const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  owner: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  shippingAddress: {
    type: String,
    required: true
  },
  estimatedDelivery: {
    type: String
  },
  products: {
    type:[Schema.Types.Mixed],
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  }

})
module.exports = mongoose.model('order', orderSchema);