const path = require('path')
const multer = require('multer')

const diskStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, path.parse(file.originalname).name + '-' + uniqueSuffix + path.extname(file.originalname))
  },
  destination: './images'
})

const multerInstance = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!(ext === '.jpg' || ext === '.jpeg' || ext === '.png')) {
      return cb(new Error('not supported format'))
    }
    cb(null, true)
  }
})
module.exports = multerInstance