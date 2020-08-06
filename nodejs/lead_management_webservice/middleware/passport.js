//@ts-check
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/users')

passport.use(new LocalStrategy(function(username, password, done){
    login(username, password, done);
}));

passport.serializeUser( (user, done) => {
    done(null, user.id);
});
   
passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

function login(user, pass, done){
    User.findOne({username: user}, (err, account) => {
        if(account && !err)
            bcrypt.compare(pass, account.hash, function(err, info){
                if(info){ 
                    account.last_accessed = new Date(); // Today, logged for CRON deletion of old accounts.
                    account.save();
                    return done(null, account); 
                }
                else return done(err, false);
            });
        else return done(err || {msg: "No account found."});
    });
}

module.exports = passport;