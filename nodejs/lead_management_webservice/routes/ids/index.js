//@ts-checkzz
const Id = require('../../models/ids');
const logger = require('../../common/logger');

function createNewLeadId(callback){
    Id.findOneAndUpdate({id: process.env.COUNTER_ID}, {$inc: {count: 1}}, {new: true}, (err, counter) => {
        if(err){ 
            logger.log('accounts', `Error creating new Id, more info- ${err}`);
            return callback(err); 
        }
        else 
            return callback(false, counter.count);
    })
}

function createManyNewLeadIds(amount, callback){
    Id.findOneAndUpdate({id: process.env.COUNTER_ID}, {$inc: {count: amount}}, {new: true}, (err, counter) => {
        console.log('Id:', counter);
        if(err){ 
            logger.log('accounts', `Error creating multiple new Ids, more info- ${err}`);
            return callback(err);
        }
        else 
            return callback(false, counter.count);
    })
}

module.exports = {
    createNewLeadId,
    createManyNewLeadIds
}
