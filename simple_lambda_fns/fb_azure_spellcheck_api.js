//@ts-check
let https = require('https');

exports.handler = async (event, ctx, cb) => {
    const { text } = event;
    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/spellcheck';

    let key = process.env.spell_key;
    let query_string = "?mkt=en-US&mode=proof";
    
    let request_params = {
        method : 'POST',
        hostname : host,
        path : path + query_string,
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length' : text.length + 5,
            'Ocp-Apim-Subscription-Key' : key,
        }
    };
    
    let response_handler = response => {
        let body = '';
        response.on ('data', function (d) {
            body += d;
        });
        response.on ('end', () => {
            const fixedText = fixErrors(text, JSON.parse(body));
            cb(null, fixedText);
        });
        response.on ('error', e => {
            console.log ('Error: ' + e.message);
        });
    };
    
    let req = https.request(request_params, response_handler);
    req.write("text=" + text);
    req.end();
}

function fixErrors(sentence, result){
    for(let i = 0; result.flaggedTokens[i] != undefined ; i++) 
        if(result.flaggedTokens[i].suggestions[0].score >= .3) 
            sentence = sentence.replace(result.flaggedTokens[i].token, result.flaggedTokens[i].suggestions[0].suggestion);
    return sentence;
}
