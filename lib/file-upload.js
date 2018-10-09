'use strict'

/**
 * Prepare file uploader
 */

const fs = require('fs');
const multer = require('multer');
const randomstring = require('randomstring');

module.exports = initFileUpload;

/**
 * Init file uploader
 * @param  {object} app
 * @return {object}      File uploader
 */
function initFileUpload(app) {
    const storage = multer.diskStorage({
        destination: function(request, file, callback) {
            return uploadFolder(app, callback);
        },
        filename: function (request, file, callback) {
            callback(null, file.originalname);
        }
    })

    return multer({ storage: storage });
}

/**
 * Specify folder path for uploading file
 * @param  {object}   app
 * @param  {Function} callback 
 */
function uploadFolder(app, callback) {
    const tmpFolder = app.locals.tmpFolder;
    const folder = tmpFolder + '/' + randomstring.generate();    

    app.locals.fileFolder = folder;

    console.log('Make folder ' + folder);

    fs.mkdir(folder, error => {
        error ?
            callback('Error while creating temp folder: ' + error) :
            callback(null, folder);
    });
}