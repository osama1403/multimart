const User = require('../models/User')
const Seller = require('../models/Seller')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

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
          const JWT = jwt.sign({ email: email, id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: 10 })
          const refreshToken = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' })

          res.cookie('RT', refreshToken, { httpOnly: true, secure: 'true', sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
          return res.status(200).json({ token: JWT, role: 'user', id: user._id, userData })
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, msg: 'server error' })
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
          const JWT = jwt.sign({ email: email, id: seller._id, role: 'seller' }, process.env.JWT_SECRET, { expiresIn: 10 })
          const refreshToken = jwt.sign({ id: seller._id, role: 'seller' }, process.env.JWT_SECRET, { expiresIn: '7d' })

          res.cookie('RT', refreshToken, { httpOnly: true, secure: 'true', sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 })
          return res.status(200).json({ token: JWT, role: 'seller', id: seller._id })

        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, msg: 'server error' })
    }
  }
  res.status(400).json({ success: false, msg: "invalid credentials" });
}


const handleRefresh = async (req, res) => {
  console.log('refresh');
  // console.log(req.cookies.RT);
  if (req.cookies?.RT) {
    const refreshToken = req.cookies.RT
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return res.status(403).send('Unauthorizedsssssss')
      }

      try {
        const { id, role } = decode
        if (role === 'user') {
          // handle user refresh
          const user = await User.findById(id)
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
          const JWT = jwt.sign({ email: user.email, id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: 10 })
          return res.status(200).json({ token: JWT, role: 'user', id: user._id, userData })


        } else {
          //handle seller refresh
          const seller = await Seller.findById(id)
          const JWT = jwt.sign({ email: seller.email, id: seller._id, role: 'seller' }, process.env.JWT_SECRET)
          res.status(200).json({ token: JWT, role: 'seller', id: seller._id })
        }

      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'server error' })
      }

    })
  } else {
    return res.status(403).send('Unauthorized')
  }
}

const handleLogout = (req, res) => {
  const refreshCookie = req.cookies?.RT
  console.log(refreshCookie);
  if (refreshCookie) {
    res.clearCookie('RT', { httpOnly: true, secure: true, sameSite: 'none' })
    res.send('logged out')
  }
}

module.exports = { handleLogin, handleSellerLogin, handleRefresh, handleLogout }