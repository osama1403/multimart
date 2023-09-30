const express = require('express')
const loginRouter = require('./login')
const signUpRouter = require('./signUp')
const productsRouter = require('./products')
// const productsRouter = require ('./products')
// const {updateProfilePic} = require ('../controllers/userController')
const sellerRouter = require('./seller')
const userRouter = require('./user')

const apiRouter = express.Router()

apiRouter.use('/products', productsRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/seller', sellerRouter)
apiRouter.use('/login', loginRouter)
apiRouter.use('/signup', signUpRouter)
// apiRouter.get('/sas',(req,res)=>{res})

module.exports = apiRouter


