const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentOrderSchema = new Schema({
  owner: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  },
  products: {
    type: [Schema.Types.Mixed],
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
module.exports = mongoose.model('paymentorder', paymentOrderSchema);