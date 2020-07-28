const fs = require('fs');

function log(filename, body){
    let str = (new Date()).toString() + ':    ' + body + '\n';
    
    let stream = fs.createWriteStream(
        `${global.appRoot}/logs/${filename}.txt`, 
        { flags: "a" }
    );
    stream.write(str);
    stream.close();
}

module.exports = {
    log
}