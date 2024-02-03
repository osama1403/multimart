const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const connectDB = require('./Configuration/db');
const apiRouter = require('./routers/api')
const cors = require('cors')
const socketIo = require('socket.io')
const app = express();
const ioIsAuthenticated = require('./middlewares/ioIsAuthenticated')
const { ioRegisterEvents, ioConnectionNotifications } = require('./Configuration/ioEvents')

require('dotenv').config();

app.use(express.json());
// app.use(express.static('./images'))
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

connectDB()

app.use('/api', apiRouter)

mongoose.connection.once('open', () => {
  console.log("DB connected");
  const server = app.listen(5000, () => { console.log('server is up on port 5000'); })

  const io = socketIo(server, {
    cors: 'http://localhost:3000'
  })
  app.locals.io = io
  const onConnection = async (socket) => {
    console.log('user connected io');
    socket.join(socket.userId)
    ioRegisterEvents(io, socket)
    await ioConnectionNotifications(io, socket)
  }

  io.use(ioIsAuthenticated)
  io.on('connection', onConnection)
})

