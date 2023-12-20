const express = require('express')
const authRouter = require('./auth')
const signUpRouter = require('./signUp')
const productsRouter = require('./products')
const sellerRouter = require('./seller')
const userRouter = require('./user')
const chatRouter = require('./chat')

const apiRouter = express.Router()

apiRouter.use('/products', productsRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/seller', sellerRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/signup', signUpRouter)
apiRouter.use('/chat', chatRouter)

module.exports = apiRouter


