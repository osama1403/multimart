const express = require('express')
const { fulfillOrder } = require('../controllers/ordersController')

const webhookRouter = express.Router()

webhookRouter.post('/stripe', fulfillOrder)

module.exports = webhookRouter