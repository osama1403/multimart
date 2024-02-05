const express = require('express')
const imagesRouter = express.Router()
const { GetObjectCommand,S3Client } = require('@aws-sdk/client-s3')
const s3 = new S3Client()


//  *** THIS FILE IS FOR SERVING IMAGES FROM S3 BUCKET IF APPLICABLE ***


imagesRouter.get('/:key', async (req, res) => {
  try{
    const key = req.params.key
    const response = await s3.send(new GetObjectCommand({
      Bucket: process.env.BUCKET,
      Key: key
    }))

    if (key.toLowerCase().endsWith('.jpg') || key.toLowerCase().endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }else if(key.toLowerCase().endsWith('.png')){
      res.setHeader('Content-Type', 'image/png');
    }else{
      return res.status(403).send(unsupported)
    }

    response.Body.pipe(res)

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