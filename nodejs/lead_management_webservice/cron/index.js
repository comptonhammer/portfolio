const cron = require('node-cron');
const User = require('../models/users');

const logger = require('../common/logger');

cron.schedule('0 */6 * * *', () => {
    console.log('Running cron check of inactive accounts...');
    let sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

    logger.log('cron', `Running cron check for accounts last accessed before ${sixMonthsAgo.toDateString()}`);
    
    User.find({}, (err, accounts) => {
        if(err) 
            return console.log(err);
        for(let i = 0; i < accounts.length; i++){
            if(new Date(accounts[i].last_accessed) < sixMonthsAgo && accounts[i].impregnable === false){
                console.log('Deleting', accounts[i].username);
                logger.log('cron', `Account ${accounts[i].username} flagged for deletion`);
                deleteAccount(accounts[i]);
            }
        }
    })
})

function deleteAccount(account){
    User.findOneAndDelete({username:account.username, hash:account.hash}, (err) =>{
        if(err){
            logger.log('cron', `Error deleting account ${account.username}`);
            return console.log(`Error deleting account ${account.username}.`);
        }
        else return console.log(`${account.username} deleted.`)
    })
}