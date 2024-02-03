const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required:true
  },
  lastName:{
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
  phone: {
    type:String,
    default:''
  },
  address1:  {
    type:String,
    default:''
  },
  address2:  {
    type:String,
    default:''
  },
  profilePicture : String,
  wishlist:{
    type:[String],
    default:[]
  },
  cart:{
    type:[Schema.Types.Mixed],
    default:[]
  },
  

})
module.exports = mongoose.model('user', userSchema);