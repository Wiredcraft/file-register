var debug = require('debug')('carcass:fileRegister');

var fs = require('fs');
var path = require('path');
var mixable = require('mixable-object');

// Copied from bluebird.
function isPrimitive(val) {
  return val == null || val === true || val === false ||
    typeof val === 'string' || typeof val === 'number';
}

/**
 * Get or build a sub register for an object.
 */
function subRegister(obj, name) {
  var res;
  res = isPrimitive(obj[name]) ? {} : obj[name];
  return obj[name] = mixable(res).mixin(proto, 'register', 'extend');
}

/**
 * Try to handle with require().
 */
function registerMod(leaf, dir, name) {
  var modPath;
  try {
    modPath = require.resolve(dir);
  } catch (_error) {}
  if (modPath == null) {
    return false;
  }
  // Define a getter with the base name.
  name = path.basename(name, path.extname(name));
  Object.defineProperty(leaf, name, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (require.cache[modPath] == null) {
        debug('loading %s.', modPath);
      }
      return require(modPath);
    }
  });
  return true;
}

/**
 * Try to handle as a directory.
 */
function registerDir(leaf, dir, name) {
  var files;
  try {
    files = fs.readdirSync(dir);
  } catch (_error) {}
  if (files == null) {
    return false;
  }
  if (name != null) {
    leaf = subRegister(leaf, name);
  }
  for (var i = 0, len = files.length; i < len; i++) {
    name = files[i];
    leaf.register(dir, name);
  }
  return true;
}

/**
 * Register.
 *
 * Map file structure to an object.
 *
 * @param {String} root the path to the file or directory
 * @param {String} ...names the names are not only path to the files but also path
 *   to the attributes
 *
 * @return {this}
 */
function register(root) {
  var leaf = this; // jscs:ignore safeContextKeyword
  // TODO: default base path?
  var dir = path.resolve(root);
  // Try as a directory if no name given.
  if (arguments.length <= 1) {
    registerDir(this, dir);
    return this;
  }
  // The names are not only path to the files but also path to the attributes.
  for (var i = 1, len = arguments.length - 1; i < len; i++) {
    var sub = arguments[i];
    leaf = subRegister(leaf, sub);
    dir = path.resolve(dir, sub);
  }
  // Only the last name is registered (others are used as the path; see above).
  var name = arguments[i++];
  dir = path.resolve(dir, name);
  // Handle with require if possible.
  if (registerMod(leaf, dir, name)) {
    return this;
  }
  // Handle as a directory if possible.
  registerDir(leaf, dir, name);
  return this;
}

// Keep enumerable as they're supposed to be used in real prototypes.
module.exports = {
  register: register,
  // Powered with merge() but for historic reasons named extend().
  extend: mixable.merge
};

// To be used with the sub registers, so put them innumerable.
var proto = Object.defineProperties({}, {
  register: {
    configurable: true,
    enumerable: false,
    value: register
  },
  extend: {
    configurable: true,
    enumerable: false,
    value: mixable.merge
  }
});
