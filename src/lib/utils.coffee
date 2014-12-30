debug = require('debug')('carcass:fileRegister')

fs = require('fs')
path = require('path')

# Copied from bluebird.
isPrimitive = (value) ->
    return (not value?) or (value is true) or (value is false) or
        (typeof value is 'string') or (typeof value is 'number')

# Copied from bluebird.
isObject = (value) ->
    return not isPrimitive(value)

###*
 * Defines a getter, which is simply a require().
 *
 * @param {Object} leaf
 * @param {String} name
 * @param {String} modPath
 *
 * @return {undefined}
###
defineGetter = (leaf, name, modPath) ->
    name = path.basename(name, path.extname(name))
    Object.defineProperty(leaf, name, {
        configurable: true
        enumerable: true
        get: ->
            debug('loading %s.', modPath) if not require.cache[modPath]?
            return require(modPath)
    })
    return

###*
 * Recursively registers a directory.
 *
 * @param {Object} leaf
 * @param {String} dir
 * @param {String} name
 *
 * @return {undefined}
###
walk = (leaf, dir, name) ->
    subPath = path.resolve(dir, name)
    # Handle with require if possible.
    try modPath = require.resolve(subPath)
    if modPath?
        return defineGetter(leaf, name, modPath)
    # Handle as a directory if possible.
    try files = fs.readdirSync(subPath)
    if files?
        # Create an object if nothing is there.
        leaf[name] = {} if not leaf[name]?
        # But do not override.
        return if isPrimitive(leaf[name])
        # Walk recursively.
        walk(leaf[name], subPath, filename) for filename in files
    # TODO: what else?
    return

module.exports = {
    isPrimitive: isPrimitive
    isObject: isObject
    defineGetter: defineGetter
    walk: walk
}
