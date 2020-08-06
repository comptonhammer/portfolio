const stripe = require('stripe')(process.env.STRIPE_PRIV_KEY);

// Abstracted in case we switch payment providers

function charge(total, token, callback){
    stripe.charges.create({
        amount: total,
        source: token,
        currency: 'usd'
    })
    .then(() => {
        callback()
    })
    .catch(() => {
        let err = {
            code: 500,
            errMsg: 'Charge Failed...'
        }
        callback(err);
    })
}

module.exports = {
    charge
}