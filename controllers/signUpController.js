const User = require('../models/User')
const Seller = require ('../models/Seller')
const bcrypt = require('bcrypt')

const handleSignUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  // console.log(req.body);
  if (email && password && firstName && lastName) {
    // validate input 
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email)
    const validPassword = password.length > 7;
    if (!validEmail || !validPassword) {
      res.status(400).json({ success: false, msg: 'invalid email or password' })
      return
    }

    try {
      const founduser = await User.findOne({ email: email });

      if (!founduser) {
        const hashedpw = await bcrypt.hash(password, 4)
        const created = await User.create({ firstName, lastName, email, password: hashedpw });
        if (created) {
          res.json({ success: true, msg: 'sign up succeded' })
          return
        }
      } else {
        res.status(400).json({ success: false, msg: 'user already exist' })
        return
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: 'server error' })
    }
  } else {
    res.status(400).json({ success: false, msg: 'please provide all credentialss' })
  }
}

const handleSellerSignUp = async (req, res) => {
  const { email, password, shopName } = req.body;
  if (email && password && shopName) {
    // validate input 
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email)
    const validPassword = password.length > 7;
    if (!validEmail || !validPassword) {
      res.status(400).json({ success: false, msg: 'invalid email or password' })
      return
    }

    try {
      const founduser = await Seller.findOne({ email: email });

      if (!founduser) {
        const hashedpw = await bcrypt.hash(password, 4)
        const created = await Seller.create({ shopName, email, password: hashedpw });
        if (created) {
          res.json({ success: true, msg: 'sign up succeded' })
          return
        }
      } else {
        res.status(400).json({ success: false, msg: 'user already exist' })
        return
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: 'server error' })
    }
  } else {
    res.status(400).json({ success: false, msg: 'please provide all credentialss' })
  }
}


module.exports = { handleSignUp,handleSellerSignUp };