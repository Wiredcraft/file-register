fs = require('fs')
path = require('path')
mixin = require('mixable-object').mixin
utils = require('./utils')

###*
 * Register.
 *
 * Map file structure to an object.
 *
 * @param {String} root the path to the file or directory
 * @param {String} ...names the names are not only path to the files but also path
 *   to the attributes
 *
 * @return {this}
###
register = (root, names..., name) ->
    leaf = @
    # TODO: default base path?
    dir = path.resolve(root)
    # Read directory if no name given.
    if not name?
        try files = fs.readdirSync(dir)
        return @ if not files?
        utils.walk(leaf, dir, filename) for filename in files
        return @
    # The names are not only path to the files but also path to the attributes.
    for sub in names
        # Must be an object.
        leaf[sub] = {} if utils.isPrimitive(leaf[sub])
        leaf = leaf[sub]
        dir = path.resolve(dir, sub)
    # Walk recursively.
    utils.walk(leaf, dir, name)
    return @

###*
 * Extend with another register.
 *
 * @param {Object} lib another register
 * @param {String} ...names the attributes that will be merged.
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
