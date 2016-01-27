# File Register

[![Build Status](https://travis-ci.org/Wiredcraft/file-register.svg?branch=master)](https://travis-ci.org/Wiredcraft/file-register) [![Coverage Status](https://coveralls.io/repos/github/Wiredcraft/file-register/badge.svg?branch=master)](https://coveralls.io/github/Wiredcraft/file-register?branch=master)

(Node.js) The way we organize code: break into files and folders and map to an object.

Originally part of [Carcass](https://github.com/Wiredcraft/carcass).

## How to use

First you wanna organize your files with directories. For example say you have a group of files and directories look like this:

```
example/
    index.js
    lib/
        utils.js
        models/
            User.js
            ...
        views/
            index.js
            ...
        ...
```

### Quick usage

Put this in the `index.js` file:

```js
var Register = require('file-register');
var example = new Register();
example.register(__dirname, 'lib');
```

Now you have everything in `lib/` mapped to the `example.lib` object.

```js
example.lib.should.have.property('utils');
example.lib.should.have.property('models');
example.lib.should.have.property('views');
```

### Some details (about the above example)

For files, the key is the filename without the extension, and the value is what you can get with `require(file)` (i.e. whatever the file exports).

```js
example.lib.should.have.property('utils').with.type('object');
example.lib.utils.should.have.property('lorem').with.type('function');
```

For directories, if `require()` can handle it (i.e. there's an `index.js` or `package.json` etc.), we use `require()`.

```js
example.lib.should.have.property('views').with.type('string');
```

Otherwise the directory is mapped recursively.

```js
example.lib.should.have.property('models').with.type('object');
example.lib.models.should.have.property('User').with.type('function');
```

### For advanced usage, see

- `test/example/`
- `test/example.mocha.js`

## Git summary

```
 project  : file-register
 repo age : 1 year, 1 month
 active   : 7 days
 commits  : 18
 files    : 17
 authors  :
    18  Makara Wang  100.0%
```
