const express = require('express')
const { handleLogin, handleSellerLogin } = require('../controllers/loginController')

const loginRouter = express.Router()

loginRouter.post('/', handleLogin)
loginRouter.post('/seller', handleSellerLogin)

module.exports = loginRouter;