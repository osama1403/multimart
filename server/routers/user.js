const express = require('express');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const { addToCart, removeFromCart,getCart } = require('../controllers/cartController')
const { getProfile, updateProfilePic } = require('../controllers/userController');
const isUser = require('../middlewares/isUser');
const userRouter = express.Router();

userRouter.use((req,res,next)=>{
  console.log('user router hit ')
  next()
})
userRouter.use(isUser)

userRouter.post('/addtowishlist', addToWishlist)
userRouter.post('/removefromwishlist', removeFromWishlist)
userRouter.post('/addtocart', addToCart)
userRouter.post('/removefromcart', removeFromCart)
userRouter.get('/wishlist', getWishlist)
userRouter.get('/cart', getCart)
userRouter.get('/profile', getProfile)
userRouter.post('/updatepfp', updateProfilePic)
module.exports = userRouter