const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const sellerSchema = new Schema({
 shopName: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required:true
  },
  password: {
    type: String,
    required:true
  },
  balance:{
    type:Number,
    default:0
  },
  bio:{
    type:String,
    default:''
  },
  profilePicture:String,
  coverPicture:String,
  phone: Number,
  address: String,
})
module.exports = mongoose.model('seller', sellerSchema)
