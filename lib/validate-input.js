'use strict'

const getType = require('type-detect');

module.exports = {
    file: validateFile,
    data: validateData
}

/**
 * Validate uloaded file
 * @param  {object} request
 * @return {string|boolean}  Error message or true on success
 */
function validateFile(request) {
    if (typeof request.file === 'undefined') {
        return 'No files uploaded';
    }

    const file = request.file;
    const mimeTypes = [
        'application/vnd.oasis.opendocument.text', 
        'application/vnd.oasis.opendocument.text-template'
    ];

    if (mimeTypes.indexOf(file.mimetype) === -1) {
        return 'File should be reall ODT or OTT file';
    }

    return true;
}

/**
 * Validate input data
 * @param  {object} request
 * @return {string|object}    Error message or data
 */
function validateData(request) {
    if (typeof request.body === 'undefined' || typeof request.body.data === 'undefined') {
        return 'No data provided to insert into template';
    }

    try {
        var data = JSON.parse(request.body.data);
    } catch (e) {
        return 'Data is not a valid JSON: ' + e;
    }

    const type = getType(data);
    if (['Array', 'Object'].indexOf(type) === -1) {
        return 'Data should be an object or array';   
    }

    return data;
}
