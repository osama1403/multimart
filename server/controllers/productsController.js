const { isObjectIdOrHexString, default: mongoose } = require('mongoose');
const Product = require('../models/Product')
const Rating = require('../models/Rating')
const getJwtEmail = require('../utils/getJwtEmail')
const multerInstance = require('../Configuration/multerInstance');

const fs = require('fs');
const Order = require('../models/Order');


const getProducts = async (req, res) => {
  const pageCount = 40;
  let { page, categories } = req.query
  let search = req.query.search || ''
  page = !isNaN(page) ? page * 1 : 0;
  // console.log(categories);
  // console.log(search);
  // console.log(Array.isArray(categories));
  // console.log('page: ' + page);

  const queryFilter = categories && Array.isArray(categories) ? { categories: { $in: categories } } : {}
  queryFilter.name = { $regex: search, $options: 'i' }
  try {
    // const products = await Product.find(queryFilter).skip(page * pageCount).limit(pageCount);
    let data = await Product.aggregate([
      {
        $facet: {
          'info': [
            {
              $match: queryFilter
            },
            {
              $count: 'count'
            }
          ],
          'products': [
            {
              $match: queryFilter
            },
            {
              $skip: page * pageCount
            },
            {
              $limit: pageCount
            }
          ]
        }
      }
    ])

    data = data[0]
    //if aggregation couldnt find any document it will stop the pipeline and we wont get the count result
    data.info.length > 0 ? data.info = data.info[0] : data.info = { 'count': 0 }
    data.info.page = page
    // console.log(data);
    res.json(data)

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const getSingleProduct = async (req, res) => {
  // Product.create({owner:'saoijs',name:'sss',price:12})
  try {
    const { id } = req.params
    if (!isObjectIdOrHexString(id)) {
      res.status(400).json({ success: false, msg: "invalid product id" })
      return;
    }
    let product = await Product.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'sellers',
          localField: 'owner',
          foreignField: 'email',
          as: 'owner'
        }
      },
      {
        $set: {
          owner: { $arrayElemAt: ['$owner', 0] },
        }
      }
    ])
    product = product[0]
    product.owner = { id: product.owner._id, shopName: product.owner.shopName }
    res.json(product)
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}

// const getHomePageData = async (req, res) => {
//   // get elements from categories electronics and beauty and deals , get only 10 of each
//   try {

//     const data = await Product.aggregate([
//       {
//         $facet: {
//           "electronics": [
//             {
//               $match: { categories: { $in: ["electronics"] } }
//             },
//             {
//               $limit: 10
//             }
//           ],
//           "Beauty and Personal Care": [
//             {
//               $match: { categories: { $in: ["beauty and personal care"] } }
//             },
//             {
//               $limit: 10
//             }
//           ],
//           "deals": [
//             {
//               $match: { deal: { $exist: true, $ne: {} } }
//             },
//             {
//               $limit: 10
//             }
//           ]
//         }
//       }
//     ])

//     res.json({ success: true, data: data })

//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ success: false, msg: 'server error' })
//   }

// }

const addProduct = (req, res) => {
  try {
    const upload = multerInstance.array('images', 4)
    upload(req, res, async (err) => {
      if (err?.message === 'not supported format') {
        return res.status(400).json({ success: false, msg: 'not supported format' })
      } else if (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "server error" })
      }

      const { name, price, stock, categories, specifications, customizations } = JSON.parse(req.body?.productData)
      if (!Array.isArray(categories) || categories.filter((el) => typeof(el) !== 'string').length > 0) {
        req.files?.forEach(el => {
          const filename = el.filename
          console.log(filename);
          fs.unlink('./images/' + filename, (err) => {
            if (err) {
              console.log(err);
              console.log('failed to remove file: ' + filename);
            }
          })
        })
        res.status(400).send('invalid request')
        return
      }

      const owner = getJwtEmail(req);
      const images = req.files?.map(el => el.filename)
      // console.log('files: '+req.method+req.get('Content-Type'));
      // console.log(req.body);
      try {
        const isCreated = await Product.create({ owner, name, price, stock, specifications, categories, customizations, images })
        if (isCreated) {
          res.json({ success: true, msg: 'product added successfully' })
          return
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, msg: 'server error' })
        return
      }
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, msg: 'server error' })
    return
  }

}

const getSellerProducts = async (req, res) => {
  const email = getJwtEmail(req)
  try {
    const products = await Product.find({ owner: email })
    res.json(products)
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, msg: 'server error' })
    return
  }

}


const getSellerSingleProduct = async (req, res) => {
  const { id } = req.params
  if (!isObjectIdOrHexString(id)) {
    res.status(400).json({ success: false, msg: "invalid product id" })
    return;
  }

  const email = getJwtEmail(req)
  try {
    let product = await Product.aggregate([
      {
        $match: { owner: email, _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $addFields: { strid: { $toString: '$_id' } }
      },
      {
        $lookup: {
          from: 'orders',
          let: { prodid: '$strid' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$$prodid', '$products.id']
                }
              }
            },
            {
              $project: {
                status: 1,
                products: 1
              }
            }
          ],
          as: 'allorders'
        }
      },
      {
        $project: {
          strid: 0
        }
      }

    ]);
    product = product[0]
    const ordersCount = {
      total: 0,
      pending: 0,
      processing: 0,
      shipping: 0,
      delivered: 0
    }
    // ordersCount.total = product.allorders.length
    product.allorders.forEach(el => {
      const { count } = el.products.find(el => el.id === id)
      ordersCount[el.status.toLowerCase()] += count
      ordersCount.total += count

    })
    product.ordersCount = ordersCount

    delete product.allorders

    return res.json(product)


  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}

const editStock = async (req, res) => {
  const email = getJwtEmail(req)
  try {
    const { id, mode, value } = req.body
    const prod = await Product.findById(id)
    if (prod.owner !== email) {
      res.status(403).send('unauthorized')
    }

    if (value < 0 || mode === 'REMOVE' && value > prod.stock) {
      return res.status(400).json({ msg: 'value error' })
    }
    let query = {}
    switch (mode) {
      case 'ADD':
        query = { $inc: { stock: value } }
        break;
      case 'REMOVE':
        query = { $inc: { stock: -value } }
        break;
      case 'SET':
        query = { $set: { stock: value } }
        break;
      case 'ALWAYS AVAILABLE':
        query = { $set: { stock: -1 } }
        break;
    }
    await Product.updateOne({ _id: new mongoose.Types.ObjectId(id) }, query)
    res.json({ msg: 'Updated successfully' })
    console.log(prod);

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error' })
  }

}
const rateProduct = async (req, res) => {
  const { id, rate } = req.body
  const email = getJwtEmail(req)
  try {
    const deliveredOrder = await Order.findOne({ owner: email, "products.id": id, status: "Delivered" })
    console.log(deliveredOrder);
    if (!deliveredOrder) {
      // user hasn't bought the product or the product is not delivered yet
      res.status(400).json({ success: 'false', msg: 'cannot rate product' })
      return
    }
    const isRated = await Rating.findOne({ user: email, productId: id })
    const now = new Date()
    if (isRated) {
      await Rating.updateOne({ user: email, productId: id }, { rating: rate, date: now })
    } else {
      await Product.updateOne({ _id: id }, { $inc: { totalRatingCount: 1, totalRating: rate } })
      await Rating.create({ user: email, productId: id, rating: rate, date: now })
    }
    res.json({ success: true, msg: 'rated successfully' })
  } catch (err) {
    res.status(500).json({ success: false, msg: 'server error' })
  }

}



module.exports = {
  getProducts,
  getSingleProduct,
  addProduct,
  editStock,
  getSellerProducts,
  getSellerSingleProduct,
  rateProduct
}