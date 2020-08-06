const requestPromise = require('request-promise');
const pug = require('pug');

// Can replace this with SMTP or nodemailer in the future.
// For now, integromat works fine.

function send(to, body, subject, fromName, callback){
    const opts = {
        uri: process.env.EMAILER,
        header:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        method:'POST',
        json:{
            fromName,
            body,
            to,
            subject
        }
    };
    //console.log(opts);
    requestPromise(opts)
        .then((res) => {
            callback(false, res);
        })
        .catch(callback);
}

function sendToConsultant(to, body, subject, toName, callback){
    const attr = {
        email: to, 
        name: toName,
        body
    };
    let fn = pug.compileFile('../views/email_templates/email_consultant.pug');
    const content = fn(attr);

    const opts = {
        uri: process.env.EMAILER,
        header:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        method:'POST',
        json:{
            body: content,
            fromName: 'REDACTED Services',
            to,
            subject
        }
    };
    requestPromise(opts)
        .then((res) => {
            callback(false, res);
        })
        .catch(callback);
}

module.exports = {
    send,
    sendToConsultant
}