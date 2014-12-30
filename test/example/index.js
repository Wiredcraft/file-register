var path = require('path');
var mixable = require('mixable-object');
var Register = require('../../');

// The example.
var example = mixable({});

// Use the prototype.
example.mixin(Register.proto);

// Register files.
example.register(path.resolve(__dirname, 'lib'));

// Export.
module.exports = example;
