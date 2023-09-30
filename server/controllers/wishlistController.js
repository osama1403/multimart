const User = require('../models/User');
const Wishlist = require('../models/Wishlist')
const getJwtEmail = require('../utils/getJwtEmail')

const getWishlist = async (req, res) => {
  try {
    const email = getJwtEmail(req);
    // must return products not ids
    // const data = await User.aggregate([
    //   {
    //     $match: { email: email }
    //   },
    //   {
    //     $unwind: "$wishlist"
    //   },
    //   {
    //     $addFields: {
    //       wishobjectid: {
    //         $toObjectId: '$wishlist'
    //       }
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'products',
    //       localField: 'wishobjectid',
    //       foreignField: '_id',
    //       as: 'productss'
    //     }
    //   },
      
    //   {
    //     $unwind: "$productss"
    //   },
    //   {
    //     $group:{
    //       _id:"_id",
    //       wishlist:{$push:"$productss"}
    //     }
    //   }
    // ])

    const matched = await User.aggregate([
      {
        $match: { email: email }
      },
      {
        $addFields: {
          wishids: { $map: { input: "$wishlist", in: { $toObjectId: "$$this" } } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'wishids',
          foreignField: '_id',
          as: 'productss'
        }
      },
      {
        $project:{productss:1}
      }
    ])
    res.json(matched[0]?.productss )

  } catch (e) {
    res.status(500).json({ success: false, msg: "server error" })
  }

}

const addToWishlist = async (req, res) => {
  const email = getJwtEmail(req)
  const { id } = req.body
  try {
    const isAdded = await User.updateOne({ email }, { $addToSet: { wishlist: id } })
    if (isAdded) {
      res.json({ success: true, msg: 'product added to wishlist successfully' })
      return
    }
  } catch (error) {
    console.log(e);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}
const removeFromWishlist = async (req, res) => {
  const email = getJwtEmail(req)
  const { id } = req.body
  try {
    const isRemoved = await User.updateOne({ email }, { $pull: { wishlist: id } })
    if (isRemoved) {
      res.json({ success: true, msg: 'product removed from wishlist successfully' })
      return
    }
  } catch (error) {
    console.log(e);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}


module.exports = { addToWishlist, removeFromWishlist, getWishlist }