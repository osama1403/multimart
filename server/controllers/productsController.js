const { isObjectIdOrHexString, default: mongoose } = require('mongoose');
const Product = require('../models/Product')
const getJwtEmail = require('../utils/getJwtEmail')
const multerInstance = require('../multerInstance');

const fs = require('fs')


const getProducts = async (req, res) => {
  const pageCount = 200;
  let { page, categories, limit } = req.query
  console.log(categories);
  page = !isNaN(page) ? page * 1 : 0;
  console.log(Array.isArray(categories));
  const queryFilter = categories && Array.isArray(categories) ? { categories: { $in: categories } } : {}
  try {
    const products = await Product.find(queryFilter).skip(page * pageCount).limit(limit ? limit : pageCount);
    res.json(products);
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
    const product = await Product.findById(id)
    res.json(product)
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}

const getHomePageData = async (req, res) => {
  // get elements from categories electronics and beauty and deals , get only 10 of each
  try {

    const data = await Product.aggregate([
      {
        $facet: {
          "electronics": [
            {
              $match: { categories: { $in: ["electronics"] } }
            },
            {
              $limit: 10
            }
          ],
          "Beauty and Personal Care": [
            {
              $match: { categories: { $in: ["beauty and personal care"] } }
            },
            {
              $limit: 10
            }
          ],
          "deals": [
            {
              $match: { deal: { $exist: true, $ne: {} } }
            },
            {
              $limit: 10
            }
          ]
        }
      }
    ])

    res.json({ success: true, data: data })

  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}

const addProduct = (req, res) => {
  try {
    const upload = multerInstance.array('images', 4)
    upload(req, res, async (err) => {
      if (err?.message === 'not supported format') {
        res.status(400).json({ success: false, msg: 'not supported format' })
        return
      } else if (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "serverrrrrr error" })
        return
      }

      const { name, price, stock, categories, specifications, customizations } = JSON.parse(req.body?.productData)
      if (!Array.isArray(categories) || categories.filter((el) => !typeof (el) === 'string').length > 0) {
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
        res.status(400).send('invalid data')
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
        $match: { _id: new mongoose.Types.ObjectId(id) }
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
                // products: {
                //   $elemMatch: {
                //     id: '$$prodid'
                //   }
                // }
              }
            }
          ],
          as: 'allorders'
        }
      }

    ]);
    product = product[0]
    if (product.owner !== email) {
      return res.status(400).json({ success: false, msg: 'not the owner' })
    } else {
      return res.json(product)
    }

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
    if(prod.owner !== email){
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



module.exports = {
  getProducts,
  getSingleProduct,
  getHomePageData,
  addProduct,
  editStock,
  getSellerProducts,
  getSellerSingleProduct
}