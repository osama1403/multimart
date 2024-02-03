const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new Schema({
  chatId: {
    type: Schema.ObjectId,
    required: true
  },
  author: {
    type: Schema.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'read'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})
module.exports = mongoose.model('message', messageSchema)