const User = require('../models/User');
const Cart = require('../models/Cart')
const getJwtEmail = require('../utils/getJwtEmail');
const Order = require('../models/Order');
const Product = require('../models/Product')
const mongoose = require('mongoose');
const Seller = require('../models/Seller');

const placeOrder = async (req, res) => {
  const email = getJwtEmail(req)
  const { address, count } = req.body
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
    
    // a product not in stock
    if (matched.products.some(el => {
      const elcount = count[el._id] ? count[el._id] : 1;
      return (!(el.stock < 0) && (el.stock - elcount < 0))
    })) {
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

    if (errInCus) {
      return res.status(401).json({ success: false, msg: 'faulty cart data' })
    }

    //order processing
    //separate products by seller and add count to the object
    const orders = new Map()
    matched.products.forEach(el => {
      if (!orders.has(el.owner)) {
        orders.set(el.owner, [{ ...matched.cart.find(e => el._id.equals(e.id)), count: count[el._id] ? count[el._id] : 1, reducestock: el.stock < 0 ? false : true }])
      } else {
        orders.get(el.owner).push({ ...matched.cart.find(e => el._id.equals(e.id)), count: count[el._id] ? count[el._id] : 1, reducestock: el.stock < 0 ? false : true })
      }
    });
    console.log(orders);

    const taxRate = 0.08 // 8%
    const currentDate = new Date()
    const finalOrders = []
    const productsBulk = []
    const sellersBulk = []

    for (const [seller, items] of orders) {
      const subtotal = items.reduce((p, el) => {
        return (p + ((matched.products.find(e => e._id.equals(el.id)).price) * el.count))
      }, 0)
      console.log(seller);
      const tax = Math.round(taxRate * subtotal)

      const totalCost = subtotal + tax
      const o = new Order({ owner: email, seller, date: currentDate, shippingAddress: address, products: items, totalCost, subtotal, tax })
      finalOrders.push(o)

      //
      sellersBulk.push({
        updateOne: {
          filter: { email: seller },
          update: {
            $inc: { balance: subtotal },
          }
        }
      })

      items.forEach(el => {
        productsBulk.push({
          updateOne: {
            filter: { _id: el.id },
            update: {
              $inc: { sold: el.count, stock: el.reducestock ? -el.count : 0 },
            }
          }
        })
      })
    }

    await Order.insertMany(finalOrders)
    await Product.bulkWrite(productsBulk)
    await Seller.bulkWrite(sellersBulk)
    await
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
        $sort: { date: -1 }
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
          'productsElements.owner': 0,
          'productsElements.price': 0,
          'productsElements.stock': 0,
          'productsElements.sold': 0,
          'productsElements.rating': 0,
          'productsElements.customizations': 0,
          'productsElements.specifications': 0,
          'productsElements.images': 0,
          'productsElements.categories': 0,
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
          from: 'ratings',
          let: { prodids: '$productsIds' },
          pipeline: [
            {
              $match: {
                user: email,
                $expr: {
                  $in: ['$productId', '$$prodids']
                }
              }
            }

          ],
          as: 'ratings'
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
const sellerGetSingleOrder = async (req, res) => {
  const email = getJwtEmail(req)
  const { id } = req.params
  console.log(id + email);
  try {
    const matched = await Order.aggregate([
      {
        $match: { seller: email, _id: new mongoose.Types.ObjectId(id) }
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

const sellerGetOrders = async (req, res) => {
  const email = getJwtEmail(req)
  try {
    const orders = await Order.find({ seller: email }).sort({ date: -1 })
    res.json(orders)
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error' })
  }

}
const sellerUpgradeStatus = async (req, res) => {
  const { id } = req.body
  const email = getJwtEmail(req)
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).send('not valid id')
  }
  try {
    const order = await Order.findOne({ _id: id, seller: email })
    if (order) {
      const status = order.status === 'Pending' ? 'Processing' : order.status === 'Processing' ? 'Shipping' : 'Delivered'
      await Order.updateOne({ _id: id }, { status: status })
      res.json({ success: true, msg: 'order updated successfully', status })
    }
    else {
      res.status(400).json({ msg: 'invalid' })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error' })
  }

}
module.exports = { placeOrder, getOrders, getSingleOrder, sellerGetOrders, sellerGetSingleOrder, sellerUpgradeStatus }