var Register, mixable, path;

path = require('path');

mixable = require('mixable-object');


/**
 * A simple implementation that does nothing but only register files.
 */

module.exports = Register = (function() {
  function Register() {}

  return Register;

})();

Register.proto = require('./lib/proto');

mixable(Register);

Register.prototype.mixin(Register.proto);
