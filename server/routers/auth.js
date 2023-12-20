const express = require('express')
const cookieParser = require('cookie-parser')
const { handleLogin, handleSellerLogin, handleRefresh, handleLogout } = require('../controllers/authController')
const isAuthenticated = require('../middlewares/isAuthenticated')
const authRouter = express.Router()
authRouter.use(cookieParser())

authRouter.post('/login', handleLogin)
authRouter.post('/sellerlogin', handleSellerLogin)
authRouter.get('/refresh', handleRefresh)
authRouter.get('/logout',isAuthenticated, handleLogout)

module.exports = authRouter;