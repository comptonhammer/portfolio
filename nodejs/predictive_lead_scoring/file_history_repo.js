const azure = require('../common/azure');
const logger = require('../common/logger');
const fs = require('file-system');

function downloadFileToServer(name, callback){
    azure.getFromAzure(name, body => {
        let savedFilePath = global.appRoot + '/temp/' + name;
        fs.writeFile(savedFilePath, body, () => {
          callback(savedFilePath);
        });
    });
}

function deleteFileFromServer(name, callback){
    azure.deleteFromAzure(name, callback);
}

function listHistoryWithDates(prefix, callback){
    azure.listFiles(prefix, (err, result) => {
        if(err){ 
            logger.log('azure', `Error in listFiles/listHistory, more info=> ${err}`);
        }
        else {
            let files = [];
            result.entries.files.forEach(entry => {
                files.push(entry.name); 
            });
            files.sort();
            files.reverse();

            let filesDates = [];
            for(let i = 0; i < files.length; i++){
                let _x = files[i].replace(prefix,'');
                let y = _x.split("-")[0];
                let m = _x.split("-")[1];
                let d = _x.split("-")[2];
                let hr = _x.split("-")[3];
                let min = _x.split("-")[4];
                filesDates[i] = [files[i], `${y}/${m}/${d} ${hr}:${min}`];
            }
            return callback(false, filesDates);
        }
    })
}

function paginate(arr, indexesPerPage){
    let pageIndex = 0;
    let pages = [[]];
    for(let i = 0, j = 0; i < arr.length; i++){
        pages[pageIndex][j] = arr[i];
        if (i % indexesPerPage === 0 && i != 0){
            pageIndex++;
            if(i + 1 < arr.length) 
                pages.push([]);
            j = 0;
        }
        else j++;
    }
    return pages;
}

module.exports = {
    downloadFileToServer,
    deleteFileFromServer,
    listHistoryWithDates,
    paginate
}
