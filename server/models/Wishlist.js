const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wishlistSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  count:{
    type:Number,
    default:0
  },
  products: {
    type:[Schema.ObjectId],
    default:[]
  }

})
module.exports = mongoose.model('wishlist', wishlistSchema);