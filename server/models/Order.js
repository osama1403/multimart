const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  owner:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  orderNum:{
    type:Number,
    required:true
  },
  status:{
    type:String,
    default:'Pending'
  },
  shippingAdress:{
    type:String,
    required:true
  },
  estimatedDelivery:{
    type:String,
    required:true
  },
  totalCost:{
    type:Number,
    required:true
  },
  subtotal:{
    type:Number,
    required:true
  },
  shippingCost:{
    type:Number,
    required:true
  },
  tax:{
    type:Number,
    required:true
  }

})
module.exports = mongoose.model('order',orderSchema);