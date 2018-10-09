'use strict'

const fs = require('fs-extra');
const extractZip = require('extract-zip');
const zip = require('adm-zip');
const path = require('path');

module.exports = {
    edit: odtEditor
}

/**
 * Edit ODT template
 * @param  {object} data       Data to be inserted into template
 * @param  {string} pathToFile Path to ODT template
 * @return {string}            Path to ready ODT file with data inserted
 */
function odtEditor(data, odtPath, unzipPath) {
    const ext = path.extname(odtPath);
    unzipPath += '/' + path.basename(odtPath, ext);

    return unzipOdt(odtPath, unzipPath)
        .then(() => getContent(unzipPath))
        .then(content => insertData(data, content))
        .then(content => zipContent(content, odtPath))
        .then(() => removeTmpFiles(unzipPath))
        .then(() => onFinish(odtPath));
}

/**
 * Open ODT file
 * @param  {string} source  Path to ODT file
 * @param  {string} toDir   Where to extract ODT file contents
 * @return {string}         Path to .xml file with ODT text content
 */
function unzipOdt(source, toDir) {
    return new Promise((resolve, reject) => {
        console.log('Extracting odt file to ' + toDir);

        extractZip(source, {dir: toDir}, error => {
            if (error) return reject('Error while opening odt file: ' + error);
            resolve();
        });        
    });
}

/**
 * Get content of ODT's content.xml file
 * @param  {string} path  Path to content.xml
 * @return {string}       File contents
 */
function getContent(path) {
    path += '/content.xml'

    console.log('Getting content from file ' + path);

    return fs.readFile(path, 'utf8')
        .catch(error => {throw 'Error while getting odt content: ' + error});
}

/**
 * Insert data into template
 * @param  {object} data    
 * @param  {string} content
 * @return {string}           Modified template content
 */
function insertData(data, content) {
    console.log('Inserting data into content');
    console.log(data);

    content = content.replace(/<office:text>.*?<\/office:text>/, text => {
        for (var name in data) {
            var key = name.toUpperCase();
            var regexp = new RegExp('\\b' + key + '\\b', 'g');

            text = text.replace(regexp, data[name]);
        }       

        return text;
    })

    return content;
}

/**
 * Replace content in odt archive with updated version
 * @param  {string} content
 * @param  {string} odtPath
 */
function zipContent(content, odtPath) {
    console.log('Add updated content to odt file ' + odtPath);

    const buffer = Buffer.from(content, 'utf-8');
    const zipper = new zip(odtPath);

    //zipper.updateFile for some reason can strip data, so we first delete file, and then add it
    zipper.deleteFile('content.xml');
    zipper.addFile('content.xml', buffer);
    zipper.writeZip(odtPath);
}

/**
 * Remove unzipped odt files
 * @param  {string} path
 */
function removeTmpFiles(path) {
    console.log('Removing unzipped tmp files');

    return fs.remove(path)
        .catch(error => {throw 'Error while removing tmp files: ' + error});
}

/**
 * Do some final actions on finish
 * @param  {string} path  Path to odt file
 * @return {string}       Path to odt
 */
function onFinish(path) {
    console.log('Ready odt file at path ' + path);
    return path;
}
