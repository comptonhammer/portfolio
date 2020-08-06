const fs = require('fs');

function log(filename, body){
    let stream = fs.createWriteStream(`${global.appRoot}/logs/${filename}.txt`, { flags: "a" });
    stream.write((new Date()).toString() + ':   ' + body + '\n');
    stream.close();
}

module.exports = {
    log
}