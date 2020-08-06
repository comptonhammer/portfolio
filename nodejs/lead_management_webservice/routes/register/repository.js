//@ts-check
const robinRepo = require('../robins/repository');
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const { registerSchema } = require('../../common/schema');
const emailer = require('../../common/emailer');

function registerAccount(accountInfo, callback){
    const result = Joi.validate(accountInfo, registerSchema);
    if(result.error){
        console.log('Invalid', result);
        return callback({err: true, msg:result.value});
    }

    if(accountInfo.password != accountInfo.password_confirm){
        return callback({err: true, msg:'Passwords don\'t match'});
    }
    isValidUsername(accountInfo.desired_username, (err, isValid) => {
        if(err) 
            return callback(err);
        if(!isValid) 
            return callback({err: true, msg:'Username taken'});
        createAccount(accountInfo, callback);
    })
}

function isValidUsername(username, callback){
    return isUniqueUsername(username, callback);
}

function isUniqueUsername(username, callback){
    User.findOne({username}, (err, account) => {
        if(err) 
            return callback(err);
        else{
            if(!account) 
                return callback(false, true);
            else 
                return callback(false, false);
        }
    })
}

//TODO: CLEAN UP
function createAccount(accountInfo, callback){
    bcrypt.hash(accountInfo.password, 13, (err, hash) => {
        if(err) 
            return callback({err: true, msg:'Bad password'});

        User.findOne({username:'default'}, (err, defaultAccount) => {
            if(err) 
                return callback(err);
            if(!defaultAccount) 
                return callback({err:true, msg:'Cant set defaults...'});

            let verificationCode = createVerificationCode();
            let secret = createSecret();
            let expires = new Date();
            expires.setHours(expires.getHours() + 2);
            let filledSmsTemplate = fillTemplate(defaultAccount.data.sms_template.body, accountInfo);

            let account = new User({
                created: new Date(),
                username: accountInfo.desired_username,
                organization_code: accountInfo.organization_code || '',
                data:{
                    timezone: "ALL",
                    name: accountInfo.name,
                    email: accountInfo.email,
                    address: accountInfo.address,
                    cell_phone: accountInfo.cell_phone,
                    home_phone: accountInfo.home_phone,
                    organization: accountInfo.organization || '',
                    email_template:{
                        title: defaultAccount.data.email_template.title,
                        body: fillTemplate(defaultAccount.data.email_template.body, accountInfo),
                        from: fillTemplate(defaultAccount.data.email_template.from, accountInfo)
                    },
                    sms_template:{
                        body: filledSmsTemplate.length > 149 ? '' : filledSmsTemplate
                    },
                    autosend: defaultAccount.data.autosend,
                    account: {
                        ...defaultAccount.data.account,
                        active: false, // Set false until email verification
                        verification:{
                            code: verificationCode,
                            secret,
                            expires
                        }
                    }
                },
                hash
                
            });

            if(accountInfo.organization_code) 
                robinRepo.getNewRobinAccountId(accountInfo.organization_code, (err, newId) => {
                    if(err) 
                        return callback(err);
                    
                    account.round_robin_id = newId;
                    account.save((err) => {
                        if(err) 
                            return callback({err: true, msg:'Couldn\'t talk to database right now'});

                        emailVerificationCode(accountInfo.email, verificationCode, secret);
                        return callback(false, secret);
                    });
                })
            else{
                emailVerificationCode(accountInfo.email, verificationCode, secret);
                return callback(false, secret);
            }
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
    for (let i = 0; i < 6; i++){
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
}

function createSecret(){
    let secret = '';
    let possible = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
    for (let i = 0; i < 19; i++){
        secret += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return secret;
}

function emailVerificationCode(email, code, secret){
    let link = `https://portal.REDACTED.com/register/verify?session=${secret}`
    let body = `Your verification code is: <b>${code}</b>. It is only good for an hour so enter it ASAP! 
        Click <a href="${link}">here</a> if you have lost your page.`;
    emailer.send(email, body, 'Your Verification Code', 'REDACTED Services', (err) => {
        if(err) console.log(err);
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
                return;
            }
            let verificationCode = createVerificationCode();
            let newSecret = createSecret();
            let expires = new Date(Date.now() + 3600000);

            account.data.account.verification = {
                code: verificationCode,
                secret: newSecret,
                expires
            }
            account.save((err) => {
                if(err) return callback(err);

                emailVerificationCode(account.data.email, verificationCode, newSecret);
                return callback({err: true, msg:'Code expired. Resending...'});
            })
        }
        else return callback({err: true, msg:'Invalid verification code.'});
    })
}

function sendResetCode(username, callback){
    User.findOne({username}, (err, account) => {
        if(err) return callback(err);
        if(!account) return callback({err: true, msg:'No account with that username.'});

        let verificationCode = createSecret();
        let expires = new Date();
        expires.setHours(expires.getHours() + 2);

        account.data.account.verification.code = verificationCode;
        account.data.account.verification.expires = expires;
        account.save((err) => {
            if(err) return callback(err);
            
            emailPasswordResetCode(account.data.email, verificationCode);
            return callback(false, verificationCode);
        })
        
    })
}

function emailPasswordResetCode(email, code){
    let link = `https://portal.REDACTED.com/reset/${code}`;
    let body = `Here is your password reset link: <a href="${link}">${link}</a>. It is only good for an hour so enter it ASAP!.
    <br>If you did not request this link, please ignore this email and your password will remain unchanged.`;
    emailer.send(email, body, 'Your Reset Link', 'REDACTED Lead Services', (err) => {
        if(err) console.log(err);
    });
}

function verifyResetCode(codeEntered, callback){
    User.findOne({'data.account.verification.code':codeEntered}, (err, account) => {
        if(err){ 
            console.log('Couldnt connect to DB');
            return callback(err);
        }
        if(!account){ 
            console.log('Can\'t find account.');
            return callback({err:true, msg:'No account'}); 
        }

        let isntExpired = notExpired(account.data.account.verification.expires);
        if(codeEntered === account.data.account.verification.code && isntExpired){
            return callback(false, true);
        }
        else if(!isntExpired){ 
            console.log('Token expired.');
            return callback({err:true,msg:'Token expired.'});
        }
        else{
            console.log('Codes do not match.');
            return callback({err:true, msg:'Codes do not match.'});
        }
    })
}

function notExpired(date){
    return new Date() <= new Date(date);
}

function resetPassword(key, newPassword, callback){
    bcrypt.hash(newPassword, 13, (err, hash) => {
        if(err) return callback(err);
        User.findOne({'data.account.verification.code':key}, (err, account) => {
            if(err) return callback(err);
            if(!account) return callback({err:true, msg:'No account'});
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