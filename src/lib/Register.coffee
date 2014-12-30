mixable = require('mixable-object')

###*
 * A simple implementation that does nothing but only register files.
###
module.exports = class Register

# Mixin.
mixable(Register)
Register::mixin(require('./proto'))

# Export things.
Register::register(__dirname)
