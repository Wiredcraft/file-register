path = require('path')
mixable = require('mixable-object')

###*
 * A simple implementation that does nothing but only register files.
###
module.exports = class Register

# Export the original prototype.
Register.proto = require('./lib/proto')

# Mixin.
mixable(Register)
Register::mixin(Register.proto)
