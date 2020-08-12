//@ts-check
let User = require('../models/users/users');
let schedule = require('node-schedule');
const logger = require('../common/logger');

schedule.scheduleJob('0 */3 * * *', () => {
//schedule.scheduleJob('*/3 * * * *', function(){
    let todaysDate = new Date();
    let todaysDateStr = todaysDate.toDateString();
    console.log('Running renewal check. Todays date is:', todaysDateStr);
    checkRenewalDates(todaysDateStr, todaysDate);
})

function checkRenewalDates(todaysDateStr, todaysDate){
    User.find({'subscription.renewal':todaysDateStr, 'account.standing':true}, (err, accounts) =>{
        if(err) 
            console.log('Error checking renewal dates in mongoose!');
        else accounts.forEach(account => {
            if(account.subscription._cancelled === true)
                User.findOneAndUpdate({username:account.username}, {'account.pulls':0, 'account.standing':false}, err =>{
                        if(err){
                            console.log('Err updating cancellation of', account.username, err);
                            logger.log(
                                'cron', 
                                `Error updating cancellation of ${account.username}, more info=> ${err}`
                            );
                        }
                        else{
                            console.log(account.username, 'sub cancelled (renewal date is today)');
                            logger.log(
                                'cron', 
                                `Successfully cancelled sub of ${account.username}`
                            );
                        }
                    });
            else{
                let nextDate = new Date(todaysDate.setDate(todaysDate.getDate()+30));
                let nextDateStr = nextDate.toDateString();
                User.findOneAndUpdate({username:account.username}, {'account.pulls':0, 'subscription.renewal': nextDateStr}, (err) =>{
                    if(err){ 
                        console.log('Error updating pulls of:', account.username, err);
                        logger.log('cron', `Error updating pulls of ${account.username}, more info=> ${err}`);
                    }
                    else{ 
                        console.log(account.username, `renewed and pulls reset (renewal date is today). Next renewal: ${nextDateStr}`);
                        logger.log('cron', `Successfully updated pulls of ${account.username}. Next renewal: ${nextDateStr}`);
                    }
                });
            }
        });
    })
}
