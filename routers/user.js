const express = require('express');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const { addToCart, removeFromCart, getCart } = require('../controllers/cartController')
const { getProfile, updateProfilePic, updateInfo } = require('../controllers/userController');
const { placeOrder, getOrders ,getSingleOrder} = require('../controllers/ordersController');
const isUser = require('../middlewares/isUser');
const { rateProduct } = require('../controllers/productsController');
const userRouter = express.Router();

userRouter.use((req, res, next) => {
  console.log('user router hit ')
  next()
})
userRouter.use(isUser)

userRouter.post('/addtowishlist', addToWishlist)
userRouter.post('/removefromwishlist', removeFromWishlist)
userRouter.post('/addtocart', addToCart)
userRouter.post('/removefromcart', removeFromCart)
userRouter.post('/updatepfp', updateProfilePic)
userRouter.post('/updateinfo', updateInfo)
userRouter.post('/placeorder', placeOrder)
userRouter.post('/rateproduct', rateProduct)
userRouter.get('/wishlist', getWishlist)
userRouter.get('/cart', getCart)
userRouter.get('/profile', getProfile)
userRouter.get('/orders', getOrders)
userRouter.get('/orders/:id', getSingleOrder)
module.exports = userRouter