//@ts-check
let bcrypt = require('bcrypt');
let log = require('clg-color');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let UserAccount = require('../models/users/users');
const logger = require('../common/logger');

passport.use(new LocalStrategy( (username, password, done) => {
    UserAccount.findOne({ username }, (err, account) => {
        if(err){
            logger.log(
                'passport', 
                `Error logging in, more info=> ${err}`
            );
            return done(err);
        }
        else if(account){ 
            bcrypt.compare(password, account.hash, (err,res) => {
                if(err){
                    logger.log(
                        'passport', 
                        `Error in bcrypt, more info=> ${err}`
                    );
                }
                else if(res) {
                    if (account.standing){
                        return done(null, account);
                    }
                }
                else {
                    log.warning('! Wrong Password');
                    logger.log(
                        'login', 
                        `User ${username} tried to log in with wrong password`
                    );
                    return done(null, false);
                }
            });
        }
        else{
            log.error('No account found');
            return done(!account);
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    UserAccount.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;
