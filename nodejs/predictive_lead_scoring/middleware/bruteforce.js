//@ts-check
let ExpressBrute = require('express-brute');
let store;
if(process.env.ENVIRONMENT === 'DEBUG'){
    store = new ExpressBrute.MemoryStore();
}
else{
    let brutes = require('../models/bruteforce/bruteforce');
    let MongooseStore = require('./mongoose_store');
    store = new MongooseStore(brutes);
}

let bruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    lifetime: 60*60*2
});
module.exports = bruteforce;
