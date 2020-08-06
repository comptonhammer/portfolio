const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;
const client = require('twilio');
const twilio = client(sid, token);

function sendMessage(body, to, callback){
    twilio.messages.create({body, to, from: getPhoneNumber()})
        .then(message => {
            console.log(message.sid);
            callback();
        })
        .catch(callback);
}

function getPhoneNumber(){
    return process.env.TWILIO_NUMBER;
}

module.exports = {
    sendMessage
}