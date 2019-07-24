//Excerpt from a Node.js MVC webapp. This part handles registration and password reset
// By Alec Moore

const User = require('../../models/users');
const robinRepo = require('../robins/repository');
const bcrypt = require('bcrypt');
const emailer = require('../../common/emailer');

function registerAccount(accountInfo, callback){
    if(accountInfo.password != accountInfo.password_confirm) 
        return callback({err: true, msg:'Passwords don\'t match'});
    isValidUsername(accountInfo.desired_username, (err, isValid) => {
        if(err) 
            return callback(err);
        if(!isValid) 
            return callback({err: true, msg:'Username taken'});
        createAccount(accountInfo, callback);
    })
}

function isValidUsername(username, callback){
    let notValidMsg = 'Username contains invalid character:';
    let naughtyLads = [
        '/',
        '\\',
        '[',
        ']',
        '>',
        '<',
        ';',
        ':',
        '{',
        '}',
        ')',
        '(',
        '"',
        '|',
        '*',
        '^',
        '%',
        '$',
        '#',
        '!',
        '+',
        '=',
        ',',
        '?',
        '~',
        '`'
    ]
    for(let i = 0; i < naughtyLads.length; i++){
        if(username.includes(naughtyLads[i])) 
            return callback(notValidMsg + ' ' + naughtyLads[i], false);
    }
    for(let i = 0; i < username.length; i++)
        if(username.charCodeAt(i) < 123 && username.charCodeAt(i) > 32) 
            return callback(notValidMsg + ' ' + username[i], false);
    return isUniqueUsername(username, callback);
}

function isUniqueUsername(username, callback){
    User.findOne({username}, (err, account) => {
        if(err) 
            return callback(err);
        else if(!account) 
            return callback(false, true);
        else 
            return callback(false, false);
    })
}

function createAccount(accountInfo, callback){
    bcrypt.hash(accountInfo.password, 13, (err, hash) => {
        if(err) 
            return callback({err: true, msg:'Bad password'});
        
        let account = new User;
        let expires = new Date();
        let verificationCode = createVerificationCode();
        let secret = createSecret();
        
        expires.setHours(expires.getHours() + 2);

        account.created = new Date();
        account.username = accountInfo.desired_username;
        account.hash = hash;
        account.data.name = accountInfo.name;
        account.data.email = accountInfo.email;
        account.data.address = accountInfo.address;
        account.data.cell_phone = accountInfo.cell_phone;
        account.data.home_phone = accountInfo.home_phone;
        account.data.address = accountInfo.address;
        account.data.organization = accountInfo.organization;
        account.data.timezone = "ALL";

        User.findOne({username:'default'}, (err, defaultAccount) => { 
            // Account 'default' contains some of the default values for an account
            if(err) 
                return callback(err);
            if(!defaultAccount) 
                return callback({err:true, msg:'Cant set defaults...'});

            account.data.email_template.title = defaultAccount.data.email_template.title;
            account.data.email_template.body = fillTemplate(defaultAccount.data.email_template.body, accountInfo);
            account.data.email_template.from = fillTemplate(defaultAccount.data.email_template.from, accountInfo);;
            account.data.sms_template.body = fillTemplate(defaultAccount.data.sms_template.body, accountInfo);
            account.data.autosend = defaultAccount.data.autosend;
            account.data.account = defaultAccount.data.account;
            account.data.account.active = false; // Set false until email verification
            account.data.account.verification.code = verificationCode;
            account.data.account.verification.secret = secret;
            account.data.account.verification.expires = expires;

            robinRepo.getNewRobinAccountId((err, newId) => {
                if(err) 
                    return callback(err);
                
                account.round_robin_id = newId;
                account.save(err => {
                    if(err) 
                        return callback({err: true, msg:'Couldn\'t talk to database right now'});
                    emailVerificationCode(accountInfo.email, verificationCode, secret);
                    return callback(false, secret);
                });
            })
        })
    })
}

function fillTemplate(string, account){
    while(string.includes('#{NAME}')) 
        string = string.replace('#{NAME}', account.name);
    while(string.includes('#{FIRST_NAME}')) 
        string = string.replace('#{FIRST_NAME}', account.name.split(' ')[0]);
    while(string.includes('#{CELL_PHONE}')) 
        string = string.replace('#{CELL_PHONE}', account.cell_phone);
    while(string.includes('#{EMAIL}')) 
        string = string.replace('#{EMAIL}', account.email);
    return string;
}

function createVerificationCode(){
    let code = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 6; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    return code;
}

function createSecret(){
    let secret = '';
    let possible = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
    for (let i = 0; i < 19; i++)
        secret += possible.charAt(Math.floor(Math.random() * possible.length));
    return secret;
}

function emailVerificationCode(email, code, secret){
    let link = `https://REDACTED/register/verify?session=${secret}`
    let body = `Your verification code is: <b>${code}</b>. It is only good for an hour so enter it ASAP! 
        Click <a href="${link}">here</a> if you have lost your page.`;
    emailer.send(email, body, 'Your Verification Code', 'REDACTED Services', (err) => {
        if(err) 
            console.log(err);
    });
}

function verifyAccount(codeEntered, secret, callback){
    User.findOne({'data.account.verification.secret': secret, 'data.account.active': false}, (err, account) => {
        if(err) 
            return callback(err);
        if(!account) 
            return callback({err: true, msg:'Invalid account secret.'});
        if(codeEntered == account.data.account.verification.code){
            let isntExpired = notExpired(account.data.account.verification.expires);
            if(isntExpired){
                account.data.account.active = true;
                account.data.account.verification = {};
                account.save(callback);
            }
            else{ 
                let verificationCode = createVerificationCode();
                let newSecret = createSecret();
                let expires = Date.now() + 3600000;
                account.data.account.verification.code = verificationCode;
                account.data.account.verification.secret = newSecret;
                account.data.account.verification.expires = expires;
                account.save((err) => {
                    if(err) 
                        return callback(err);
                    emailVerificationCode(account.data.email, verificationCode, newSecret);
                    return callback({err: true, msg:'Code expired. Resending...'});
                })
                
            }
        }
        else return callback({err: true, msg:'Invalid verification code.'});
    })
}

function sendResetCode(username, callback){
    User.findOne({username}, (err, account) => {
        if(err) 
            return callback(err);
        if(!account) 
            return callback({err: true, msg:'No account with that username.'});

        let verificationCode = createSecret();
        let expires = new Date();
        expires.setHours(expires.getHours() + 2);

        account.data.account.verification.code = verificationCode;
        account.data.account.verification.expires = expires;
        account.save((err) => {
            if(err) 
                return callback(err);
            
            emailPasswordResetCode(account.data.email, verificationCode);
            return callback(false, verificationCode);
        })
        
    })
}

function emailPasswordResetCode(email, code){
    let link = `https://REDACTED/reset/${code}`;
    let body = `Here is your password reset link: <a href="${link}">${link}</a>. It is only good for an hour so enter it ASAP!.
    If you did not request this link, please ignore this email and your password will remain unchanged.`;
    emailer.send(email, body, 'Your Reset Link', 'REDACTED Services', err => {
        if(err) console.log(err);
    });
}

function verifyResetCode(codeEntered, callback){
    User.findOne({'data.account.verification.code':codeEntered}, (err, account) => {
        if(err) 
            return callback(err);
        if(!account) 
            return callback({err:true, msg:'No account'});

        const isntExpired = notExpired(account.data.account.verification.expires);
        if(codeEntered === account.data.account.verification.code && isntExpired){
            return callback(false, true);
        }
        else if(!isntExpired) 
            return callback({err:true,msg:'Token expired.'});
        else 
            return callback({err:true, msg:'Codes do not match.'});
    })
}

function notExpired(date){
    return new Date() <= new Date(date);
}

function resetPassword(key, newPassword, callback){
    bcrypt.hash(newPassword, 13, (err, hash) => {
        if(err) 
            return callback(err);
        User.findOne({'data.account.verification.code':key}, (err, account) => {
            if(err) 
                return callback(err);
            if(!account) 
                return callback({err:true, msg:'No account'});
            account.hash = hash;
            account.save(callback);
        })
    })
}

module.exports = {
    registerAccount,
    verifyAccount,
    sendResetCode,
    verifyResetCode,
    resetPassword
}
