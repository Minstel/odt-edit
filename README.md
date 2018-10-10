ODT Edit Web-Service
===

This is a web-service with API for performing simple editing of text files for LibreOffice (thus of types `.odt` and `.ott`).

Installation
---

```
    npm install odt-edit
```

Running the server
---

To run service web-server, just use the following command:

```
    node index.js
```

Usage
---

Application API has a single path to call - `POST /`. So it's a POST request to server root. Request should be of type `multipart/form-data`. There should be two parameters for this request:

* `template` - `.odt` or `.ott` file
* `data` - JSON object, that holds data to insert into template

Template file should have placeholders in places, where values from `data` object should be used. Placeholders should be in all upper case. 

Here's an example of template: 

```
    Name: PERSON.NAME
    Last name: PERSON.LAST_NAME
    Phone 1: PERSON.CONTACT.0.PHONE
    Adress 1: PERSON.CONTACT.0.ADRESS
    Phone 2: PERSON.CONTACT.1.PHONE
    Adress 2: PERSON.CONTACT.1.ADRESS
    Date: DATE
```

Then corresponding `data` parameter can look smth like this:

```
    {
        "person": {
            "name": "John",
            "last_name": "Doe",
            "contact": [
                {
                    "phone": 12345,
                    "adress": "New York"
                },
                {
                    "phone": 67890,
                    "adress": "Dublin"
                }
            ]
        },
        "date": "12 June 2018"
    }
```

Substitution result will be:

```
    Name: John
    Last name: Doe
    Phone 1: 12345
    Adress 1: New York
    Phone 2: 67890
    Adress 2: Dublin
    Date: 12 June 2018
```

Values, that go earlier in `data` object, can reference later values. For example:

```
    {
        "company": {
            "copyright": "Kelvin & Co COMPANY.YEAR",
            "year": "2018"
        }
    }
```

Limitations
---

For now it works in a pretty straitforward way:

* No cycles or conditions support, like in big template engines. Just substitution of values. 
* One can not use placeholder like `PERSON.CONTACT`, trying to insert the whole array, casting it to string. Such placeholder will be ignored. Only the primitive values, located at the end of keypaths, are inserted into template.
