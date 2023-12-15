const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    console.log("dburi : "+process.env.DB_URI);
    const dburi = process.env.DB_URI
    console.log("env dburi : " + dburi);
    const dbur = 'mongodb://127.0.0.1:27017/multimart'
    mongoose.connect(dburi);

  }catch (err) {
    console.log(err);
  }

}

module.exports = connectDB ;