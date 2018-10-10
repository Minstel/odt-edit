'use strict';

/**
 * Unit tests for odt-editor module
 */

const odtEditor = require('../../lib/odt-editor');

describe('ODT editor', function () {
    function keyPathProvider() {
        const content = 
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<office:document-content>' +
                '<office:body>' +
                    '<office:text>' +
                        '<text:p text:style-name="P1">Human name: PERSON.NAME</text:p>' +
                        '<text:p text:style-name="P1">Last name: PERSON.LAST_NAME</text:p>' +
                        '<text:p text:style-name="P1">Phones: PERSON.DATA.0.PHONE, PERSON.DATA.1.PHONE</text:p>' +
                        '<text:p text:style-name="P1">Full name: PERSON.NAME PERSON.LAST_NAME</text:p>' +
                        '<text:p text:style-name="P1">Year: YEAR</text:p>' +
                    '</office:text>' +
                '</office:body>' +
            '</office:document-content>'
        ;

        const expected = 
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<office:document-content>' +
                '<office:body>' +
                    '<office:text>' +
                        '<text:p text:style-name="P1">Human name: John</text:p>' +
                        '<text:p text:style-name="P1">Last name: Doe</text:p>' +
                        '<text:p text:style-name="P1">Phones: 12345, 67890</text:p>' +
                        '<text:p text:style-name="P1">Full name: John Doe</text:p>' +
                        '<text:p text:style-name="P1">Year: 2018</text:p>' +
                    '</office:text>' +
                '</office:body>' +
            '</office:document-content>'
        ;

        const data = {
            person: {
                name: 'John',
                last_name: 'Doe',
                data: [
                    {
                        phone: '12345',
                        adress: 'New-York'
                    },
                    {
                        phone: '67890',
                        adress: 'Moon'
                    }
                ]
            },
            year: '2018'
        };

        return [
            {note: 'should process empty content', data: data, content: '', expected: ''},
            {note: 'shouldn\'t process content, if there\'s no <office:text> tag', data: data, content: 'PERSON.NAME', expected: 'PERSON.NAME'},
            {note: 'should process valid xml content', data: data, content: content, expected: expected},
        ];
    }

    keyPathProvider().forEach(function(spec) {
        it(spec.note, function() {
            const result = odtEditor.insertData(spec.data, spec.content);

            expect(result).toEqual(spec.expected);
        })
    })
});