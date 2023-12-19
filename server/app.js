const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const connectDB = require('./Configuration/db');
const apiRouter = require('./routers/api')
const cors = require('cors')
const socketIo = require('socket.io')
const app = express();
const ioIsAuthenticated = require('./middlewares/ioIsAuthenticated')
const {ioRegisterEvents,ioConnectionNotifications} = require('./Configuration/ioEvents')

app.use(express.json());
require('dotenv').config();

connectDB()
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}))
app.use(express.static('./images'))
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization , Accept");
//   next();
// });

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', apiRouter)
app.get("/*", (req, res) => {
  // res.sendFile('../build/index.html');
  res.sendFile('index.html', { root: path.join(__dirname, 'build') });

  // res.json({"success":"true"})
})
mongoose.connection.once('open', () => {
  console.log("db connected");
  const server = app.listen(5000, () => { console.log('server is up on port 5000'); })

  const io = socketIo(server, {
    cors: 'http://localhost:3000'
  })
  app.locals.io = io
  const onConnection = async(socket) => {
    console.log('user connected io');
    socket.join(socket.userId)
    ioRegisterEvents(io, socket)
    await ioConnectionNotifications(io,socket)
  }
  // console.log(app.locals.io);
  io.use(ioIsAuthenticated)
  io.on('connection', onConnection)
})

