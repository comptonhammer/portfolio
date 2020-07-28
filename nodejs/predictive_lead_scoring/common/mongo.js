//@ts-check
let log = require("clg-color");
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, '!%! Error on connection to MongoDB...'));
db.once('open', () =>  log.info('% MongoDB connection success...'));

module.exports = mongoose;