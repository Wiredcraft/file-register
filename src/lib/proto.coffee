fs = require('fs')
path = require('path')
utils = require('./utils')
mixable = require('mixable-object')

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

module.exports = proto = {
    register: register
    # Powered with merge() but for historic reasons named extend().
    extend: mixable.merge
}
