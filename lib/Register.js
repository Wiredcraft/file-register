var Register, mixable;

mixable = require('mixable-object');


/**
 * A simple implementation that does nothing but only register files.
 */

module.exports = Register = (function() {
  function Register() {}

  return Register;

})();

mixable(Register);

Register.prototype.mixin(require('./proto'));

Register.prototype.register(__dirname);
