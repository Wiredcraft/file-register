var proto;
var slice = require('sliced');

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
  return obj[name] = mixable(res).mixin(proto);
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
    get: function() {
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
  var i;
  var len = files.length;
  for (i = 0; i < len; i++) {
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
  var i;
  var len;
  var names = 3 <= arguments.length ? slice(arguments, 1, i = arguments.length - 1) : (i = 1, []);
  var name = arguments[i++];
  var leaf = this; // jscs:ignore safeContextKeyword
  // TODO: default base path?
  var dir = path.resolve(root);
  // Try as a directory if no name given.
  if (name == null) {
    registerDir(this, dir);
    return this;
  }
  // The names are not only path to the files but also path to the attributes.
  for (i = 0, len = names.length; i < len; i++) {
    var sub = names[i];
    leaf = subRegister(leaf, sub);
    dir = path.resolve(dir, sub);
  }
  dir = path.resolve(dir, name);
  // Handle with require if possible.
  if (registerMod(leaf, dir, name)) {
    return this;
  }
  // Handle as a directory if possible.
  registerDir(leaf, dir, name);
  return this;
}

module.exports = proto = {
  register: register,
  // Powered with merge() but for historic reasons named extend().
  extend: mixable.merge
};
