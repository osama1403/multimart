const express = require('express');
const isSeller = require('../middlewares/isSeller');
const { addProduct,editStock, getSellerProducts,getSellerSingleProduct } = require('../controllers/productsController');
const sellerRouter = express.Router();

sellerRouter.use(isSeller)

sellerRouter.use((req,res,next)=>{
  console.log('seller router hit ')
  next()
})

sellerRouter.post('/addproduct', addProduct)
sellerRouter.post('/editstock', editStock)

sellerRouter.get('/products', getSellerProducts)
sellerRouter.get('/products/:id',getSellerSingleProduct )

module.exports = sellerRouter;