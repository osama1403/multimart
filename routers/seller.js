const express = require('express');
const isSeller = require('../middlewares/isSeller');
const { addProduct, editStock, getSellerProducts, getSellerSingleProduct } = require('../controllers/productsController');
const { sellerGetOrders , sellerGetSingleOrder,sellerUpgradeStatus} = require('../controllers/ordersController')
const{sellerGetDashboard, sellerUpdateProfile} = require('../controllers/sellerController')
const sellerRouter = express.Router();

sellerRouter.use(isSeller)

sellerRouter.use((req, res, next) => {
  console.log('seller router hit ')
  next()
})


sellerRouter.get('/products', getSellerProducts)
sellerRouter.get('/products/:id', getSellerSingleProduct)
sellerRouter.get('/orders', sellerGetOrders)
sellerRouter.get('/orders/:id', sellerGetSingleOrder)
sellerRouter.get('/dashboard', sellerGetDashboard)

sellerRouter.post('/addproduct', addProduct)
sellerRouter.post('/editstock', editStock)
sellerRouter.post('/updateprofile', sellerUpdateProfile)
sellerRouter.post('/orders/upgradestatus', sellerUpgradeStatus)

module.exports = sellerRouter;