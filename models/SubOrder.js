const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subOrderSchema = new Schema({
  orderId: {
    type: Schema.ObjectId,
    required: true
  },
  orderNumber: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  productID: {
    type:Schema.ObjectId,
    required: true
  },
  customizations: {
    type: [String],
    required:true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  },
  shippingAdress: {
    type: String,
    required: true
  },
  estimatedDelivery: {
    type: String,
    required: true
  }

})
module.exports = mongoose.model('order', orderSchema);