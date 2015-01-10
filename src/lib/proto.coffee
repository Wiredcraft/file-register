debug = require('debug')('carcass:fileRegister')

fs = require('fs')
path = require('path')
mixable = require('mixable-object')

# Copied from bluebird.
isPrimitive = (value) ->
    return (not value?) or (value is true) or (value is false) or
        (typeof value is 'string') or (typeof value is 'number')

###*
 * Get or build a sub register for an object.
###
subRegister = (obj, name) ->
    res = if isPrimitive(obj[name]) then {} else obj[name]
    return obj[name] = mixable(res).mixin(proto)

###*
 * Try to handle with require().
###
registerMod = (leaf, dir, name) ->
    try modPath = require.resolve(dir)
    return false if not modPath?
    # Define a getter with the base name.
    name = path.basename(name, path.extname(name))
    Object.defineProperty(leaf, name, {
        configurable: true
        enumerable: true
        get: ->
            debug('loading %s.', modPath) if not require.cache[modPath]?
            return require(modPath)
    })
    return true

###*
 * Try to handle as a directory.
###
registerDir = (leaf, dir, name) ->
    try files = fs.readdirSync(dir)
    return false if not files?
    leaf = subRegister(leaf, name) if name?
    leaf.register(dir, name) for name in files
    return true

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
    # Try as a directory if no name given.
    if not name?
        registerDir(leaf, dir)
        return @
    # The names are not only path to the files but also path to the attributes.
    for sub in names
        leaf = subRegister(leaf, sub)
        dir = path.resolve(dir, sub)
    dir = path.resolve(dir, name)
    # Handle with require if possible.
    return @ if registerMod(leaf, dir, name)
    # Handle as a directory if possible.
    registerDir(leaf, dir, name)
    return @

module.exports = proto = {
    register: register
    # Powered with merge() but for historic reasons named extend().
    extend: mixable.merge
}
