//@ts-check
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useFindAndModify: false });
mongoose.Promise = global.Promise;

let db = mongoose.connection; //MONGOOSE is a MONGODB implementation for NODE
db.on('error', console.error.bind(console, '!%! Error on connection to MongoDB...'));
db.once('open', function(){ console.log('% MongoDB connection success...'); });

module.exports = mongoose;