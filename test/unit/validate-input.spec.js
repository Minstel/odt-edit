'use strict';

/**
 * Unit tests for validate-input module
 */

const validateInput = require('../../lib/validate-input');

describe('Input validation', function () {
    function fileProvider() {
        return [
            {note: 'should return error if no file is present', request: {}, expected: 'No files uploaded'},
            {note: 'should return error about wrong file type for .doc', request: {file: {mimetype: 'doc'}}, expected: 'File should be reall ODT or OTT file'},
            {note: 'should return error about wrong file type for .odt', request: {file: {mimetype: 'odt'}}, expected: 'File should be reall ODT or OTT file'},
            {note: 'should return error about wrong file type for .ott', request: {file: {mimetype: 'ott'}}, expected: 'File should be reall ODT or OTT file'},
            {note: 'should return error about wrong file type for .ott', request: {file: {mimetype: 'ott'}}, expected: 'File should be reall ODT or OTT file'},
            {note: 'should return true for odt mimetype', request: {file: {mimetype: 'application/vnd.oasis.opendocument.text'}}, expected: true},
            {note: 'should return true for ott mimetype', request: {file: {mimetype: 'application/vnd.oasis.opendocument.text-template'}}, expected: true},
        ];
    }

    fileProvider().forEach(function(spec) {
        it(spec.note, function() {
            const result = validateInput.file(spec.request);

            expect(result).toEqual(spec.expected);
        })
    });

    function dataProvider() {
        return [
            {note: 'should return error if no body with post params present', request: {}, expected: 'No data provided to insert into template'},
            {note: 'should return error if no "data" post param present', request: {body: {foo: 'bar'}}, expected: 'No data provided to insert into template'},
            {note: 'should return error if data is not an object or array', request: {body: {data: '"foo"'}}, expected: 'Data should be an object or array'},
            {note: 'should return error if data is not an object or array', request: {body: {data: true}}, expected: 'Data should be an object or array'},
            {note: 'should return error if data is not an object or array', request: {body: {data: false}}, expected: 'Data should be an object or array'},
            {note: 'should return error if data is not an object or array', request: {body: {data: 12}}, expected: 'Data should be an object or array'},
            {note: 'should return data if it is an object', request: {body: {data: '{"foo": "bar"}'}}, expected: {foo: 'bar'}},
            {note: 'should return data if it is an array', request: {body: {data: '["foo", "bar"]'}}, expected: ['foo', 'bar']},
        ];
    }

    dataProvider().forEach(function(spec) {
        it(spec.note, function() {
            const result = validateInput.data(spec.request);

            expect(result).toEqual(spec.expected);
        })
    });

    function dataInvalidJsonProvider() {
        return [
            {note: 'should return error if data is not a valid JSON (string)', request: {body: {data: 'foo'}}, expected: 'Data is not a valid JSON:'},
            {note: 'should return error if data is not a valid JSON (object)', request: {body: {data: {foo: 'bar'}}}, expected: 'Data is not a valid JSON:'},
            {note: 'should return error if data is not a valid JSON (array)', request: {body: {data: ['foo', 'bar']}}, expected: 'Data is not a valid JSON:'},
        ];
    }

    dataInvalidJsonProvider().forEach(function(spec) {
        it(spec.note, function() {
            const result = validateInput.data(spec.request);

            expect(result.indexOf(spec.expected)).toEqual(0);
        })
    });
});