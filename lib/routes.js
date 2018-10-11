'use strict'

/**
 * Set app routes
 */

const fs = require('fs-extra');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = yaml.load('./api-spec.yml');
const odtEditor = require('./odt-editor');
const fileUpload = require('./file-upload');
const validateInput = require('./validate-input');

module.exports = function(app) {    
    app.get('/', defaultAction);
    app.post('/', fileUpload(app).single('template'), editAction);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

/**
 * Show service description
 * @param  {object}   request
 * @param  {object}   response
 * @param  {Function} next    
 */
function defaultAction(request, response, next) {
    const info = {
        "name": "Editor for LibreOffice text files",
        "description": "Edit .ODT and .OTT templates by inserting data in place of placeholders"
    };

    response.json(info);
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
        .then(() => cleanup(file.destination))
        .catch(error => next(error));
}

/**
 * Remove tmp file folder
 * @param  {string} path
 * @return {object}       Promise
 */
function cleanup(path) {
    console.log('Cleanup. Remove tmp file folder ' + path);

    return fs.remove(path)
        .catch(error => console.error('Error removing.'));
}
