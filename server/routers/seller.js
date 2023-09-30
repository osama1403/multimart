const express = require('express');
const isSeller = require('../middlewares/isSeller');
const { addProduct, getSellerProduct,getSellerSingleProduct } = require('../controllers/productsController');
const sellerRouter = express.Router();

sellerRouter.use(isSeller)

sellerRouter.use((req,res,next)=>{
  console.log('seller router hit ')
  next()
})

sellerRouter.post('/addproduct', addProduct)
sellerRouter.get('/products', getSellerProduct)
sellerRouter.get('/products/:id',getSellerSingleProduct )

module.exports = sellerRouter;