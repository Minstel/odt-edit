'use strict'

const getType = require('type-detect');
var result = null;

module.exports = objectToKeyPath;

/**
 * Turn object into a map of keypaths
 * @param  {object} object
 * @return {object}
 */
function objectToKeyPath(object) {
    result = {};

    const type = getType(object);

    if (type === 'Object') {
        for (var name in object) {
            processProperty(name, object[name]);
        }
    } else if (type === 'Array') {
        for (var i = 0; i < object.length; i++) {
            processProperty(i, object[i]);
        }                    
    } 

    return result;
}

/**
 * Process single object's property
 * @param  {string} keypath  Property keypath in object
 * @param  {mixed} value 
 */
function processProperty(keypath, value) {
    const type = getType(value);

    if (type === 'Object') {
        for (var key in value) {
            processProperty(keypath + '.' + key, value[key]);
        }                    
    } else if (type === 'Array') {
        for (var i = 0; i < value.length; i++) {
            processProperty(keypath + '.' + i, value[i]);
        }                    
    } else {
        result[keypath] = value;
    }
}
