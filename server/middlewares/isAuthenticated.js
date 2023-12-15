const JWT = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
  const token = req.get("Authorization")
  JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(403).send('Unauthorized')
    } else {
      next()
    }
  })
}
module.exports = isAuthenticated;