let rateLimiter = require('./rate_limiter');

let standard = rateLimiter({
    lifeTimeMs: 60*1000,
    max: 25,
    message: "You've had too many requests. Wait and try again."
})

let createAccount = rateLimiter({
    lifeTimeMs: 5*60*1000,
    max: 25,
    message: "You've had too many requests. Wait and try again."
})

module.exports = {
    standard,
    createAccount
}