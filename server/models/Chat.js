const mongoose = require('mongoose')
const Schema = mongoose.Schema
const chatSchema = new Schema({

  user: {
    type: Schema.ObjectId,
    required: true
  },
  seller: {
    type: Schema.ObjectId,
    required: true
  },
  lastMessage: Schema.ObjectId
})

module.exports = mongoose.model('chat', chatSchema)