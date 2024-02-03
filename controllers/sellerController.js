const { default: mongoose } = require('mongoose');
const Seller = require('../models/Seller')
const getJwtEmail = require("../utils/getJwtEmail")
const multerInstance = require('../Configuration/multerInstance')
const getMonthName = (date) => {
  return date.toLocaleString('en-US', {
    month: 'long',
  });
}
const sellerGetDashboard = async (req, res) => {
  const email = getJwtEmail(req)

  try {
    let seller = await Seller.aggregate([
      {
        $match: { email }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'email',
          foreignField: 'seller',
          as: 'orders'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'email',
          foreignField: 'owner',
          as: 'products'
        }
      },
      {
        $project: {
          password: 0,
          'products.specifications': 0,
          'products.categories': 0,
          'products.customizations': 0,
        }
      }
    ])

    seller = seller[0]
    if (seller) {
      seller.productsCount = seller.products.length
      seller.topProducts = seller.products.sort((a, b) => b.sold - a.sold).slice(0, 5)
      delete (seller.products)

      seller.totalOrders = seller.orders.length
      seller.pending = 0
      seller.processing = 0
      seller.shipping = 0
      seller.complete = 0

      let last7days = 0
      let totalsales = 0
      const now = new Date()
      const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDay() - 7)
      const before6Months = new Date(now.getFullYear(), now.getMonth() - 5)

      let months = {}
      for (let i = 0; i < 6; i++) {
        months[getMonthName(now)] = { units: 0, revenu: 0 }
        now.setMonth(now.getMonth() - 1)
      }

      seller.orders.forEach(el => {
        //calculating total sales and  last 7 days revenu
        const orderTime = (new Date(el.date))
        totalsales += (el.subtotal + el.shippingCost)
        if (orderTime.getTime() > lastWeek.getTime()) {
          last7days += (el.subtotal + el.shippingCost)
        }
        if (orderTime.getTime() > before6Months.getTime()) {
          const ordMonName = getMonthName(orderTime)
          months[ordMonName].revenu += (el.subtotal + el.shippingCost)
          el.products.forEach(element => {
            months[ordMonName].units += element.count
          });
        }

        //counting different status 
        switch (el.status) {
          case 'Pending':
            seller.pending += 1
            break;
          case 'Processing':
            seller.processing += 1
            break;
          case 'Shipping':
            seller.shipping += 1
            break;
          case 'Complete':
            seller.cpmplete += 1
        }
      });
      // console.log(months);
      delete (seller.orders)
      seller.totalSales = totalsales
      seller.lastSevenDays = last7days

      seller.chartData = {
        months: Object.keys(months).reverse(),
        units: Array.from(Object.keys(months), el => months[el].units).reverse(),
        revenu: Array.from(Object.keys(months), el => months[el].revenu / 100).reverse()
      }
    }
    res.json(seller)

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error' })
  }
}
const getSellerProfile = async (req, res) => {
  const { id } = req.params
  console.log(id);
  try {
    let seller = await Seller.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'email',
          foreignField: 'owner',
          as: 'products'
        }
      },
      {
        $project: {
          password: 0,
          balance: 0
        }
      }
    ])
    seller = seller[0]
    res.json(seller)
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'server error' })
  }

}
const sellerUpdateProfile = async (req, res) => {
  const upload = multerInstance.array('images', 2)
  try {
    upload(req, res, async (err) => {
      if (err?.message === 'not supported format') {
        return res.status(400).json({ success: false, msg: 'not supported format' })
      } else if (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "server error" })
      }

      const updateData = JSON.parse(req.body?.data)
      const updateobj = {}
      if (updateData?.bio) {
        updateobj.bio = updateData.bio.trim().substring(0, 200)
      }
      if (updateData.shopName) {
        updateobj.shopName = updateData.shopName
      }
      if (updateData.profileImage) {
        const img = req.files?.find(el => el.originalname === updateData.profileImage).filename;
        updateobj.profilePicture = img
      }
      if (updateData.coverImage) {
        const img = req.files?.find(el => el.originalname === updateData.coverImage).filename;
        updateobj.coverPicture = img
      }

      try {
        const email = getJwtEmail(req);
        await Seller.updateOne({ email: email }, updateobj)
        res.json({ success: true, msg: 'profile updated successfully' })
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'server error' })

      }

    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: 'server error' })
  }
}
module.exports = { sellerGetDashboard, getSellerProfile, sellerUpdateProfile }
