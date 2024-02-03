const express = require('express')
const { handleSignUp, handleSellerSignUp } = require('../controllers/signUpController')

const signUpRouter = express.Router()

signUpRouter.post('/', handleSignUp)
signUpRouter.post('/seller', handleSellerSignUp)

module.exports = signUpRouter;