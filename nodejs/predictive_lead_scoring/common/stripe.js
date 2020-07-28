//@ts-check
require('dotenv').config();

let log = require('clg-color');
let stripe = new (require('stripe'))(process.env.STRIPE_KEY);
const logger = require('./logger');

function getAccount(customerId, callback){
    stripe.customers.retrieve(customerId, function(err, customer) {
        if(err){ 
            logger.log('stripe', `Error retrieving customers, more info=> ${err}`);
            return callback(err); 
        }
        else if(customer.subscriptions.total_count > 0){
            let subscriptions = customer.subscriptions;
            let todaysDate = createDateFromUnixTimecode(subscriptions.data[0].current_period_end);

            let accountInfo = {
                renewal: todaysDate.toDateString(),
                subscriptionId: subscriptions.data[0].id
            }
            return callback(false, accountInfo);
        }
        else{
            logger.log(
                'stripe', 
                `Error verifying payment with Stripe, customerId: ${customerId}`
            );
            return callback({
                err: true,
                errMsg:'Error verifying payment with Stripe. Please contact us!'
            });
        }
    });
}

function createDateFromUnixTimecode(unixDate){
    return new Date((unixDate)*1000);
}

function listLastAccounts(){
    stripe.customers.list({ limit: 99 },
        (err, customers) => {
            if(err){ 
                logger.log(
                    'stripe', 
                    `Error listing customers, more info=> ${err}`
                );
                throw err;
            }
            else if(customers.data[0]){
                for(let _i = 0; customers.data[_i]; _i++) log.info(customers.data[_i]);
                let accountInfo = {
                    sub: customers.data[0].subscriptions.data[0].items.data[0].plan.id,
                    renewal: createDateFromUnixTimecode(customers.data[0].subscriptions.data[0].current_period_end),
                    subscriptionId: customers.data[0].subscriptions.data[0].id
                }
                log.info(accountInfo);
            }
            else return false;
        }
    );
}

function deleteSub(id, callback){
    stripe.subscriptions.del(
        id,
        (err, confirmation) => {
            if(err){ 
                logger.log(
                    'stripe', 
                    `Error deleting sub, more info=> ${err}`
                );
                callback(err); 
            }
            else{ 
                logger.log(
                    'stripe', 
                    `Subscription with id: ${id} deleted.`
                );
                callback(false, confirmation); 
            }
        }
    ); 
}

module.exports = {
    getAccount,
    deleteSub,
    listLastAccounts
}