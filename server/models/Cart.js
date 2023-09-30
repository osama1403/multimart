const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  products: {
    type: [{
      productId: Schema.ObjectId,
      customizations: [{
        name: String,
        option: String
      }]
    }],
    default: []
  }

})
module.exports = mongoose.model('cart', cartSchema);