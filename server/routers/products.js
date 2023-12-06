const express = require('express')
const {getProducts,getSingleProduct} = require('../controllers/productsController')
const {getSellerProfile} = require('../controllers/sellerController')

const productsRouter = express.Router()

productsRouter.get('/',getProducts)
productsRouter.get('/seller/:id',getSellerProfile)
productsRouter.get('/:id',getSingleProduct)

module.exports = productsRouter