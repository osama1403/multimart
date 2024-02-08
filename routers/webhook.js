const express = require('express')
const { fulfillOrder } = require('../controllers/ordersController')

const webhookRouter = express.Router()

webhookRouter.post('/stripe',express.raw({ type: 'application/json' }), fulfillOrder)

module.exports = webhookRouter