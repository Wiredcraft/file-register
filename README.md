# File Register

(Node.js) The way we organize code: break into files and folders and map to an object.

Originally part of [Carcass](https://github.com/Wiredcraft/carcass).

## How to use

See `test/example/index.js` and `test/example.mocha.js` for more details.

For example say you have a group of files and directories looks like this:

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

It exports a class, and you can get an instance:

```js
var Register = require('file-register');
var example = new Register();
```

Assuming the code is in `example/index.js`:

```js
var path = require('path');
example.register(path.resolve(__dirname, 'lib'));
```

Now you have everything in `lib` mapped to the example object.

```js
example.should.have.property('utils');
example.should.have.property('models');
example.should.have.property('views');
```

For files, the key is the filename without the extension, and the value is what you can get with `require(file)` (i.e. whatever the file exports).

```js
example.should.have.property('utils').with.type('object');
example.utils.should.have.property('lorem').with.type('function');
```

For directories, if `require()` can handle it (i.e. there's an `index.js` or `package.json` etc.), we use `require()`.

```js
example.should.have.property('views').with.type('string');
```

Otherwise the directory is mapped recursively.

```js
example.should.have.property('models').with.type('object');
example.models.should.have.property('User').with.type('function');
```

### Using the proto

TODO

### API change from carcass.proto.register

TODO
