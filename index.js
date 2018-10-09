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

app.listen(port, (err) => {
    if (err) {
        return console.log('There was an error: ', err)
    }

    console.log(`server is listening on ${port}`)
});
