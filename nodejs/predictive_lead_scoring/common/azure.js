//@ts-check
let azure = require('azure-storage');
const logger = require('./logger');

const azureAccount = process.env.AZURE_STORAGE_ACCOUNT;
const azureKey = process.env.AZURE_STORAGE_ACCESS_KEY;

let fileService = azure.createFileService(azureAccount, azureKey);

function getFromAzure(filename, callback){
    fileService.getFileToText('spreadsheets', '', filename, function(error, result) {
      if (!error)
        return callback(result);
      else{
        logger.log('azure', `Error getting file, more info=> ${error}`);
        return callback();
      }
    });
}

function saveToAzure(filename, stringContents){
    fileService.createFileFromText('spreadsheets', '', filename, stringContents, function(error) {
        if (!error){ 
            logger.log('azure', `File ${filename} created!`);
        }
        else{
            logger.log('azure', `Error saving file, more info=> ${error}`);
        }
    });
}

function listFiles(prefix, callback){
    fileService.listFilesAndDirectoriesSegmentedWithPrefix('spreadsheets', '', prefix, 'null', {}, function(err, result){
        if(err){ 
            logger.log('azure', `Error listing files, more info=> ${err}`);
            callback(err); 
        }
        else callback(false, result);
    });
}

function deleteFromAzure(filename, callback){
    fileService.deleteFileIfExists('spreadsheets', '', filename, (err, result)=>{
        if(err){
            logger.log('azure', `Error deleting file ${filename}, more info=> ${err}`);
            return callback(err);
        }
        else {
            logger.log('azure', `File ${filename} deleted.`);
            return callback(false, result);
        }
    })
}

module.exports = {
    getFromAzure,
    saveToAzure,
    listFiles,
    deleteFromAzure
}
