const express = require('express')
const imagesRouter = express.Router()
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

imagesRouter.get('/:key', (req, res) => {
  try{
    const key = req.params.key
    const objectReadStream = s3.getObject({
      Bucket: process.env.BUCKET,
      Key: key
    }).createReadStream()
    objectReadStream.pipe(res)

  }catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`No such key ${filename}`)
      res.sendStatus(404).end()
    } else {
      console.log(error)
      res.sendStatus(500).end()
    }
  }

})
module.exports = imagesRouter