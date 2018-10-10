'use strict';

/**
 * Unit tests for object-to-key-path module
 */

const objectToKeyPath = require('../../lib/object-to-key-path');

describe('Converting object to keypath', function () {
    function keyPathProvider() {
        const object = {
            foo: 'bar',
            baz: [
                'test', 
                {
                    'zoo': 'fur'
                },
                'rest'
            ],
            more: {
                some: 'value'
            }
        };

        const expected = {
            foo: 'bar',
            'baz.0': 'test',
            'baz.1.zoo': 'fur',
            'baz.2': 'rest',
            'more.some': 'value'
        };

        return [
            {note: 'should process empty object', object: {}, expected: {}},
            {note: 'should process empty array', object: [], expected: {}},
            {note: 'should return empty object on primitive value', object: 'test', expected: {}},
            {note: 'should process object with few levels of nesting', object: object, expected: expected},
        ];
    }

    keyPathProvider().forEach(function(spec) {
        it(spec.note, function() {
            const result = objectToKeyPath(spec.object);

            expect(result).toEqual(spec.expected);
        })
    })
});