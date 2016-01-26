var path = require('path');
var mixable = require('mixable-object');
var Register = require('../../');

// The example.
function Example() {
  // Does many cool things.
}

// Use the prototype.
mixable(Example);
Example.prototype.mixin(Register.proto);

// Instance.
var example = new Example();

// Register files.
example.register(path.resolve(__dirname, 'lib'));

// Export.
module.exports = example;
