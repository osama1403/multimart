const User = require('../models/User');
const Cart = require('../models/Cart')
const getJwtEmail = require('../utils/getJwtEmail');
const Order = require('../models/Order');
const mongoose = require('mongoose');

const placeOrder = async (req, res) => {
  const email = getJwtEmail(req)
  const { address } = req.body
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
    // product in cart isnt in products
    // console.log(matched);

    if (matched.cart.some(el => { return !matched.products.some(e => e._id.equals(el.id)) })) {
      return res.status(400).json({ success: false, msg: 'some products are not right' })
    }
    // product is not in stock
    if (matched.products.some(el => el.stock === 0)) {
      return res.status(400).json({ success: false, msg: 'some products are unavailable' })
    }

    // check if the provided customizations are correct and matches each product options
    const errInCus = matched.cart.some(el => {
      const prod = matched.products.find(p => p._id.equals(el.id))
      const err = prod.customizations.some(prodc => {
        return (!prodc.options.includes(el.customizations[prodc.name]))
      })
      return err
    })

    console.log('orders: ');
    if (errInCus) {
      return res.status(401).json({ success: false, msg: 'faulty cart data' })
    }

    //separate products by seller
    const orders = new Map()
    matched.products.forEach(el => {
      if (!orders.has(el.owner)) {
        orders.set(el.owner, [matched.cart.find(e => el._id.equals(e.id))])
      } else {
        orders.get(el.owner).push(matched.cart.find(e => el._id.equals(e.id)))
      }
    });
    console.log(orders);
    const finalOrders = []
    const currentDate = new Date()
    console.log(currentDate);
    for (const [seller, items] of orders) {
      const subtotal = items.reduce((p, el) => {
        return (p + matched.products.find(e => e._id.equals(el.id)).price)
      }, 0)
      console.log(subtotal);
      const tax = Math.round(0.08 * subtotal)
      const shippingCost = 6000
      const totalCost = subtotal + tax + shippingCost
      const o = new Order({ owner: email, seller, date: currentDate, shippingAdress: address, products: items, totalCost, subtotal, shippingCost, tax })
      finalOrders.push(o)
    }
    await Order.insertMany(finalOrders)
    res.json({ msg: 'order added successfully' })
    // await 

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}

const getOrders = async (req, res) => {
  const email = getJwtEmail(req)
  try {
    const matches = await Order.aggregate([
      {
        $match: { owner: email }
      },
      {
        $sort:{date:-1}
      },
      {
        $addFields: {
          productsIds: { $map: { input: "$products", in: { $toObjectId: "$$this.id" } } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productsIds',
          foreignField: '_id',
          as: 'productsElements'
        }
      },
      {
        $lookup: {
          from: 'sellers',
          localField: 'seller',
          foreignField: 'email',
          as: 'seller'
        }
      },

      {
        $set: {
          seller: { $arrayElemAt: ['$seller', 0] },
        }
      },
      {
        $project: {
          'seller.password': 0,
          'seller.email': 0,
          productsIds: 0,
        }
      }
    ])
    res.json(matches)

  } catch (error) {
    res.status(500).json({ msg: 'server error' })
    console.log(error);
  }

}

const getSingleOrder = async (req, res) => {
  const email = getJwtEmail(req)
  const { id } = req.params
  console.log(id + email);
  try {
    const matched = await Order.aggregate([
      {
        $match: { owner: email, _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $addFields: {
          productsIds: { $map: { input: "$products", in: { $toObjectId: "$$this.id" } } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productsIds',
          foreignField: '_id',
          as: 'productsElements'
        }
      },
      {
        $lookup: {
          from: 'sellers',
          localField: 'seller',
          foreignField: 'email',
          as: 'seller'
        }
      },

      {
        $set: {
          seller: { $arrayElemAt: ['$seller', 0] },
        }
      },
      {
        $project: {
          'seller.password': 0,
          productsIds: 0,
        }
      }
    ])
    console.log(matched);
    res.json(matched[0])

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error' })
  }

}


module.exports = { placeOrder, getOrders, getSingleOrder }