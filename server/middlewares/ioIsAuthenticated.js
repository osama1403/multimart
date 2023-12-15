const JWT = require('jsonwebtoken')

const ioIsAuthenticated = (socket, next) => {
  const token = socket.handshake.auth.token
  JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      next(new Error('Unauthoruzed'))
    } else {
      socket.userId = decode.id
      socket.userRole = decode.role
      next()
    }
  })
}
module.exports = ioIsAuthenticated