const jwt = require('jsonwebtoken')
module.exports = (req) => {
  const token = req.get("Authorization")
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET)
  const email = decodedToken?.email;
  return email
}