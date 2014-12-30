fs = require('fs')
path = require('path')
mixin = require('mixable-object').mixin
utils = require('./utils')

###*
 * Register.
 *
 * See tests for details.
 *
 * @param root
 * @param *name
 *
 * @return {this}
###
register = (root, names..., name) ->
    leaf = @
    dir = path.resolve(root)
    # .
    if not name?
        try files = fs.readdirSync(dir)
        return @ if not files?
        utils.walk(leaf, dir, filename) for filename in files
        return @
    # .
    for sub in names
        # Must be an object.
        leaf[sub] = {} if utils.isPrimitive(leaf[sub])
        leaf = leaf[sub]
        dir = path.resolve(dir, sub)
    # .
    utils.walk(leaf, dir, name)
    return @

###*
 * Extend with another register.
 *
 * @param lib
 * @param *name
 *
 * @return {this}
###
extend = (lib, names...) ->
    for name in names
        # TODO: throw
        return if not lib[name]?
        # Create an object if nothing is there.
        @[name] = {} if not @[name]?
        # But do not override.
        mixin.call(@[name], lib[name]) if utils.isObject(@[name])
    return @

module.exports = {
    register: register
    extend: extend
}
