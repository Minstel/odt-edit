'use strict'

/**
 * Set app routes
 */

const odtEditor = require('./odt-editor');
const fileUpload = require('./file-upload');
const validateInput = require('./validate-input');

module.exports = function(app) {    
    app.post('/', fileUpload(app).single('template'), editAction);
}

/**
 * Edit odt file
 * @param  {object}   request
 * @param  {object}   response
 * @param  {Function} next    
 */
function editAction(request, response, next) {
    const validation = validateInput.file(request);
    if (validation !== true) {
        return next(validation);
    }

    const data = validateInput.data(request);
    if (typeof data === 'string') {
        return next(data);
    }

    const file = request.file;
    const unzipPath = file.destination;

    odtEditor.edit(data, file.path, unzipPath)
        .then(filePath => response.download(filePath))
        .catch(error => next(error));
}
