const express = require('express')
const cookieParser = require('cookie-parser')
const { handleLogin, handleSellerLogin, handleRefresh, handleSellerRefresh } = require('../controllers/loginController')

const loginRouter = express.Router()
loginRouter.use(cookieParser())

loginRouter.post('/', handleLogin)
loginRouter.post('/seller', handleSellerLogin)
loginRouter.get('/refresh', handleRefresh)

module.exports = loginRouter;