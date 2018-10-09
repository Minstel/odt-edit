/**
 * Handle errors
 */

const fs = require('fs-extra');

module.exports = function(app) {    
    app.use((error, request, response, next) => {
        error = formatError(error);
        console.error('Error: ', error);        

        cleanup(app)
            .then(() => response.status(500).json({ error }));
    })
}

/**
 * Format error if it's an objetc
 * @param  {string|object} error
 * @return {string|object}
 */
function formatError(error) {
    if (typeof error === 'string') return error;

    if (typeof error.code !== 'undefined') {
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return 'File input should be named "template". Instead "' + error.field + '" obtained';
        }
    }

    return error;
}

/**
 * Cleanup in case of a fatal error
 * @param  {object}   app
 * @param  {Function} callback
 */
function cleanup(app) {    
    const fileFolder = app.locals.fileFolder;

    console.log('Cleanup on error. Removing tmp file folder ' + fileFolder);

    return fs.remove(fileFolder)
        .catch(error => console.log('Error removing. Possibly it\'s already removed'));
}