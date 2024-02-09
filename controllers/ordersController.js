const User = require('../models/User');
const getJwtEmail = require('../utils/getJwtEmail');
const Order = require('../models/Order');
const Product = require('../models/Product')
const mongoose = require('mongoose');
const Seller = require('../models/Seller');
const PaymentOrder = require('../models/PaymentOrder');
const Stripe = require('stripe');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY)

const taxRate = 0.08 // 8%

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
    // product in cart is not in products

    if (matched?.cart?.some(el => { return !matched.products.some(e => e._id.equals(el.id)) })) {
      return res.status(400).json({ success: false, msg: 'some products are not right' })
    }

    // a product not in stock
    if (matched?.products?.some(el => {
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

    matched.cart.forEach(el => {
      let product = matched.products.find(e => e._id.equals(el.id))
      el.reducestock = product.stock < 0 ? false : true
      el.count = count[el.id] ? count[el.id] : 1
      el.seller = product.owner
      el.price = product.price
    })

    //updating products stock 
    let productsBulk = []
    matched.cart.forEach(el => {
      productsBulk.push({
        updateOne: {
          filter: { _id: el.id },
          update: {
            $inc: { stock: el.reducestock ? -el.count : 0 },
          }
        }
      })
    })

    const stripeItems = []
    let subtotal = 0
    let tax

    matched.cart.forEach(el => {
      const product = matched.products.find(e => e._id.equals(el.id))
      stripeItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: Object.entries(el.customizations).length > 0 ? Object.entries(el.customizations).reduce((p, [key, val]) => `${p}${key}: ${val}
            `, '') : "no customization"
            // images:product.images.length>0?[`${product.images[0]}`]:[]
          },
          unit_amount: product.price
        },
        quantity: el.count
      })
      subtotal += el.count * product.price
    })

    tax = Math.round(taxRate * subtotal)

    //add tax to stripe items
    stripeItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'TAX',
          description: `TEST CREDIT CARD NUMBER : "
          4242424242424242
          with any random details
          `
        },
        unit_amount: tax
      },
      quantity: 1
    })
    console.log(JSON.stringify(stripeItems));
    // await Product.bulkWrite(productsBulk)
    const paymentorder = await PaymentOrder.create({ owner: email, products: matched.cart, shippingAddress: address, date: new Date(), subtotal, tax, totalCost: subtotal + tax })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      line_items: stripeItems,
      metadata: { orderid: paymentorder._id.toString() },
      payment_intent_data: {
        metadata: {
          orderid: paymentorder._id.toString()
        }
      }
    })

    await Product.bulkWrite(productsBulk)

    console.log(session);
    res.json({ paymentUrl: session.url })

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}


const fulfillOrder = async (req, res) => {
  // if(success) :
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  //verify the webhook request source 
  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // console.log(event);

  try {
    switch (event.type) {
      // if payment succeeded
      case 'payment_intent.succeeded': {
        const orderid = event.data.object.metadata.orderid
        // get the paymentOrder of this session
        // console.log("orderid: " + orderid);
        const paymentOrder = await PaymentOrder.findById(orderid)
        if (paymentOrder) {
          // separate products by seller
          const orders = new Map()
          paymentOrder.products.forEach(el => {
            if (!orders.has(el.seller)) {
              orders.set(el.seller, [{ id: el.id, customizations: el.customizations, count: el.count, price: el.price }])
            } else {
              orders.get(el.seller).push({ id: el.id, customizations: el.customizations, count: el.count, price: el.price })
            }
          });

          const currentDate = new Date()
          const finalOrders = []
          const sellersBulk = []
          const productsBulk = []

          console.log(orders);

          // place the actual orders 
          // if the order contains product from multiple sellers
          // the order is separated to multiple orders one for each seller
          // add the balance for each seller
          // increase the sold units number of each products 
          // finally remove the associated paymentOrder 

          for (const [seller, items] of orders) {
            const subtotal = items.reduce((p, el) => p + (el.price * el.count), 0)
            // console.log(seller);
            const tax = Math.round(taxRate * subtotal)
            const totalCost = subtotal + tax

            const o = new Order({ owner: paymentOrder.owner, seller, date: currentDate, shippingAddress: paymentOrder.shippingAddress, products: items, totalCost, subtotal, tax })
            finalOrders.push(o)
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
                    $inc: { sold: el.count },
                  }
                }
              })
            })
          }
          await Order.insertMany(finalOrders)
          await Seller.bulkWrite(sellersBulk)
          await Product.bulkWrite(productsBulk)
          await PaymentOrder.deleteOne({ _id: paymentOrder._id })
        }
        break;
      }
      case 'payment_intent.payment_failed':
      case 'checkout.session.expired': {
        //payment failed or expired 
        // return the booked elements
        //delete the associated paymentOrder

        const orderid = event.data.object.metadata.orderid
        const paymentOrder = await PaymentOrder.findById(orderid)

        const productsBulk = []
        paymentOrder.products.forEach(el => {
          productsBulk.push({
            updateOne: {
              filter: { _id: el.id, stock: { $gte: 0 } },
              update: {
                $inc: { stock: el.count }
              }
            }
          })
        })

        await Product.bulkWrite(productsBulk)
        await PaymentOrder.deleteOne({ _id: paymentOrder._id })
        break;
      }

    }
  } catch (err) {
    console.log(err);
  }

  return res.status(200).end();

  // // get ordre from payment order
  // const paymentOrder = await PaymentOrder.findById('')
  // //maybe add seller to product when making paymentOrder to avoid aggregation
  // //handle adding money to sellers
  // //if failed return the stock

  // //order processing
  // //separate products by seller and add count to the object
  // const orders = new Map()
  // matched.products.forEach(el => {
  //   if (!orders.has(el.owner)) {
  //     orders.set(el.owner, [{ ...matched.cart.find(e => el._id.equals(e.id)), count: count[el._id] ? count[el._id] : 1, reducestock: el.stock < 0 ? false : true }])
  //   } else {
  //     orders.get(el.owner).push({ ...matched.cart.find(e => el._id.equals(e.id)), count: count[el._id] ? count[el._id] : 1, reducestock: el.stock < 0 ? false : true })
  //   }
  // });
  // console.log(orders);

  // const currentDate = new Date()
  // const finalOrders = []
  // const sellersBulk = []
  // // const productsBulk = []

  // for (const [seller, items] of orders) {
  //   const subtotal = items.reduce((p, el) => {
  //     return (p + ((matched.products.find(e => e._id.equals(el.id)).price) * el.count))
  //   }, 0)
  //   console.log(seller);
  //   const tax = Math.round(taxRate * subtotal)
  //   const totalCost = subtotal + tax

  //   const o = new Order({ owner: email, seller, date: currentDate, shippingAddress: address, products: items, totalCost, subtotal, tax })
  //   finalOrders.push(o)

  //   sellersBulk.push({
  //     updateOne: {
  //       filter: { email: seller },
  //       update: {
  //         $inc: { balance: subtotal },
  //       }
  //     }
  //   })

  //   items.forEach(el => {
  //     productsBulk.push({
  //       updateOne: {
  //         filter: { _id: el.id },
  //         update: {
  //           $inc: { sold: el.count, stock: el.reducestock ? -el.count : 0 },
  //         }
  //       }
  //     })
  //   })
  // }

  // await Order.insertMany(finalOrders)
  // await Product.bulkWrite(productsBulk)
  // await Seller.bulkWrite(sellersBulk)
  // res.json({ msg: 'order added successfully' })

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
module.exports = { placeOrder, getOrders, getSingleOrder, sellerGetOrders, sellerGetSingleOrder, sellerUpgradeStatus, fulfillOrder }