const Limit = require('../../models/limits/index');

module.exports = class {
    incr(key, lifeTimeMs = 6000, callback){
        const expiresAt = new Date(Date.now() + lifeTimeMs);
        const actions = {$inc: {counter: 1}};
        Limit.findOneAndUpdate({ip: key}, actions, {new: true}, (err, doc) => {
            if(err){ 
                console.log('MongooseStore: Error incrementing document:', err);
                return callback(err); 
            }
            if(!doc){ 
                // Create new document.
                //console.log('MongooseStore: Rate limit not found for this IP. Creating new rate limit document...')
                let newKey = new Limit({
                    ip: key,
                    counter: 1,
                    expiresAt: expiresAt
                });
                return newKey.save(err => {
                    if(err) 
                        return callback(err);
                    return callback(null, 1, expiresAt);
                });
            }
            else
                return callback(null, doc.counter + 1, expiresAt);  
        })  
    }
    
    decrement(key){
        const expiresAt = new Date(Date.now() + lifeTimeMs);
        const actions = {
            $inc: {counter: -1}, 
            $set: {expirationDate: expiresAt}
        };
        Limit.findOneAndUpdate({ip: key}, actions, {new: true}, (err, doc) => {
            if(err) 
                return console.log('MongooseStore: Error decrementing document:', err);
            if(!doc) 
                return console.log('MongooseStore: No document found for decrement...');
            //return console.log('MongooseStore: Document decremented successfully.')
        })  
    }
    
    resetKey(key){
        Limit.deleteOne({ip: key}, err => {
            if(err) 
                return console.log('MongooseStore: Error resetting document:', err);
            //console.log('MongooseStore: Document reset successfully.');
        })
    }
}