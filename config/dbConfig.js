const mongoose = require('mongoose')

//connect to database
mongoose.connect(process.env.CONN_STRING);


//connection state
const db = mongoose.connection

//check db connection
db.on('connected', () => {
    console.log('DB connection successfull!');
})

db.on('err', () => {
    console.log('DB connection failed!');
})


module.exports = db;