//@ts-check
const User = require('../models/users/users');
const logger = require('../common/logger');
const schedule = require('node-schedule');


let processEvery = '*/3 * * * *';
if(process.env.NODE_ENV === 'development')
    processEvery = '0 */3 * * *';

schedule.scheduleJob(processEvery, () => {
    const todaysDate = new Date();
    const todaysDateStr = todaysDate.toDateString();
    logger.log('cron', 'Running renewal check. Todays date is:', todaysDateStr);

    checkRenewalDates(todaysDateStr, todaysDate);
})

function checkRenewalDates(todaysDateStr, todaysDate){
    User.find({'subscription.renewal':todaysDateStr, 'account.standing':true}, (err, accounts) =>{
        if(err) 
            console.log('Error checking renewal dates in mongoose!');
        else 
            accounts.forEach(account => {
                if(account.subscription.cancelled === true)
                    User.findOneAndUpdate({username:account.username}, {'account.pulls':0, 'account.standing':false}, (err) =>{
                            if(err){
                                logger.log(
                                    'cron', 
                                    `Error updating cancellation of ${account.username}, more info=> ${err}`
                                );
                            }
                            else{
                                logger.log(
                                    'cron', 
                                    `Successfully cancelled sub of ${account.username}`
                                );
                            }
                        });
                else{
                    const nextDate = new Date(todaysDate.setDate(todaysDate.getDate()+30));
                    const nextDateStr = nextDate.toDateString();
                    const changes = {
                        'account.pulls':0, 
                        'subscription.renewal': nextDateStr
                    };

                    User.findOneAndUpdate({username:account.username}, changes, err =>{
                        if(err){ 
                            logger.log('cron', `Error updating pulls of ${account.username}, more info=> ${err}`);
                        }
                        else{ 
                            logger.log('cron', `Successfully updated pulls of ${account.username}. Next renewal: ${nextDateStr}`);
                        }
                    });
                }
            });
    })
}