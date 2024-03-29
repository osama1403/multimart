const path = require('path')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
require('dotenv').config();

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.BUCKET,
  Key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, path.parse(file.originalname).name + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// *** For disk storage ***

// const diskStorage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, path.parse(file.originalname).name + '-' + uniqueSuffix + path.extname(file.originalname))
//   },
//   destination: './images'
// })

const multerInstance = multer({
  storage: s3Storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!(ext === '.jpg' || ext === '.jpeg' || ext === '.png')) {
      return cb(new Error('not supported format'))
    }
    cb(null, true)
  }
})
module.exports = multerInstance