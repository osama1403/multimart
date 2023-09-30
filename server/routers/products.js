const express = require('express')
const productsController = require('../controllers/productsController')

const productsRouter = express.Router()

productsRouter.get('/',productsController.getProducts)
productsRouter.get('/:id',productsController.getSingleProduct)

module.exports = productsRouter