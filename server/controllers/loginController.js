const User = require('../models/User')
const Seller = require('../models/Seller')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
  // try {
  //   const { email, password } = req.body

  //   if (!email || !password) {
  //     throw new Error('invalid')
  //   }
  //   const user = await User.findOne({ email });
  //   if (!user) {
  //     throw new Error('invalid')
  //   }
  //   const verified = await bcrypt.compare(password, user.password);
  //   if (!verified) {
  //     throw new Error('invalid')
  //   }
  //   const JWT = jwt.sign({email:email,role:'user'},process.env.JWT_SECRET)
  //   res.status(200).json({token:JWT})
  // }
  // catch (err) {
  //   res.status(400).json({msg:"invalid credentials"});
  // }

  const { email, password } = req.body

  if (email && password) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email)
    const validPassword = password.length > 7;
    if (!validEmail || !validPassword) {
      res.status(400).json({ success: false, msg: 'invalid email or password' })
      return
    }
    try {
      const user = await User.findOne({ email });
      if (user) {
        const verified = await bcrypt.compare(password, user.password);
        if (verified) {
          const JWT = jwt.sign({ email: email, role: 'user' }, process.env.JWT_SECRET)
          const addresses = []
          if (user.address1)
            addresses.push(user.address1)
          if (user.address2)
            addresses.push(user.address2)

          const userData = {
            name: user.firstName + ' ' + user.lastName,
            img: user.profilePicture,
            wishlist: user.wishlist,
            cart: user.cart,
            addresses: addresses
          }
          res.status(200).json({ token: JWT, role: 'user', userData })
          return
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, msg: 'server error' })
    }
  }
  res.status(400).json({ success: false, msg: "invalid credentials" });

}




const handleSellerLogin = async (req, res) => {

  const { email, password } = req.body

  if (email && password) {

    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email)
    const validPassword = password.length > 7;
    if (!validEmail || !validPassword) {
      res.status(400).json({ success: false, msg: 'invalid email or password' })
      return
    }
    try {
      const seller = await Seller.findOne({ email });
      if (seller) {
        const verified = await bcrypt.compare(password, seller.password);
        if (verified) {
          const JWT = jwt.sign({ email: email, role: 'seller' }, process.env.JWT_SECRET)
          res.status(200).json({ token: JWT, role: 'seller' })
          return
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, msg: 'server error' })
    }
  }

  res.status(400).json({ success: false, msg: "invalid credentials" });

}


module.exports = { handleLogin, handleSellerLogin }