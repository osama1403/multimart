const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const connectDB = require('./db');
const apiRouter = require('./routers/api')
const cors = require('cors')
const app = express();
app.use(express.json());
require('dotenv').config();

connectDB()
app.use(cors())
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
  app.listen(5000, () => { console.log('server is up on port 5000'); })
})


