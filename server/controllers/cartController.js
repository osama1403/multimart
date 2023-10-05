const User = require('../models/User');
const Cart = require('../models/Cart')
const getJwtEmail = require('../utils/getJwtEmail')

const getCart = async (req, res) => {
  const email = getJwtEmail(req)
  try {
    let matched = await User.aggregate([
      {
        $match: { email, email }
      },
      {
        $addFields: {
          cartids: { $map: { input: "$cart", in: { $toObjectId: "$$this.id" } } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartids',
          foreignField: '_id',
          as: 'products'
        }
      },
      {
        $project: {
          cart: 1,
          products: 1
        }
      }
    ])

    matched = matched[0]
    res.json(matched)
  } catch (e) {
    res.status(500).json({ success: false, msg: "server error" })
  }
}

const addToCart = async (req, res) => {
  const email = getJwtEmail(req)
  const { item } = req.body
  console.log(item);
  try {
    const user = await User.findOne({ email }, { cart: 1 })
    // console.log(cart);
    if (user && !user.cart.some((el) => el.id === item.id)) {
      await User.updateOne({ email }, { $push: { cart: item } })
      res.json({ success: 'true', msg: 'product added to cart successfully' })
      return
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const removeFromCart = async (req, res) => {
  const email = getJwtEmail(req)
  const { id, refresh } = req.body
  try {
    await User.updateOne({ email }, { $pull: { cart: { id: id } } })
    if (refresh) {

      return getCart(req, res)
    }
    res.json({ success: 'true', msg: 'product removed from cart successfully' })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

module.exports = { addToCart, removeFromCart, getCart }