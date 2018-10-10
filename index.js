/**
 * App entry point, launch server
 */

const express = require('express');
const setRoutes = require('./lib/routes');
const setErrorHandler = require('./lib/error-handler.js');

const app = express();
const port = 80;

app.locals.tmpFolder = __dirname + '/tmp';

setRoutes(app);
setErrorHandler(app);

app.listen(port, error => {
    error ?
        console.error('There was an error while launching server: ' + error) :
        console.log('Server is listening on ' + port);
});
