//@ts-check
let fs = require('file-system');
let XLSX = require('xlsx');

function convertXLSXToCSV(fileName, callback){
    let xlsxStream = XLSX.readFile(global.appRoot + `/temp/${fileName}.xlsx`);
    let outputFileName = global.appRoot + `/temp/${fileName}.csv`;
    let sheetNames = xlsxStream.SheetNames;
    let stream = XLSX.stream.to_csv(xlsxStream.Sheets[sheetNames[0]]);

    stream.pipe(fs.createWriteStream(outputFileName));
    setTimeout(() => {
        callback();
    }, 50); 
}

module.exports = {
    convertXLSXToCSV
}