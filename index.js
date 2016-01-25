var path = require('path');
var mixable = require('mixable-object');

/**
 * A simple implementation that does nothing but only register files.
 */
function Register() {
  if (!(this instanceof Register)) return new Register();
}

// Export the original prototype.
Register.proto = require('./lib/proto');

// Mixin.
mixable(Register);
Register.prototype.mixin(Register.proto);

module.exports = Register;
