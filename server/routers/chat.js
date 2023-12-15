const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated')
const {getChats,getSingleChat} = require('../controllers/chatController') 

const chatRouter = express.Router()
chatRouter.use(isAuthenticated)

chatRouter.get('/',getChats)
chatRouter.get('/:id',getSingleChat)

module.exports = chatRouter

