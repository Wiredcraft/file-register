var debug, fs, isPrimitive, mixable, path, proto, register, registerDir, registerMod, subRegister,
  __slice = [].slice;

debug = require('debug')('carcass:fileRegister');

fs = require('fs');

path = require('path');

mixable = require('mixable-object');

isPrimitive = function(value) {
  return (value == null) || (value === true) || (value === false) || (typeof value === 'string') || (typeof value === 'number');
};


/**
 * Get or build a sub register for an object.
 */

subRegister = function(obj, name) {
  var res;
  res = isPrimitive(obj[name]) ? {} : obj[name];
  return obj[name] = mixable(res).mixin(proto);
};


/**
 * Try to handle with require().
 */

registerMod = function(leaf, dir, name) {
  var modPath;
  try {
    modPath = require.resolve(dir);
  } catch (_error) {}
  if (modPath == null) {
    return false;
  }
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
};


/**
 * Try to handle as a directory.
 */

registerDir = function(leaf, dir, name) {
  var files, _i, _len;
  try {
    files = fs.readdirSync(dir);
  } catch (_error) {}
  if (files == null) {
    return false;
  }
  if (name != null) {
    leaf = subRegister(leaf, name);
  }
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    name = files[_i];
    leaf.register(dir, name);
  }
  return true;
};


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

register = function() {
  var dir, leaf, name, names, root, sub, _i, _j, _len;
  root = arguments[0], names = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), name = arguments[_i++];
  leaf = this;
  dir = path.resolve(root);
  if (name == null) {
    registerDir(leaf, dir);
    return this;
  }
  for (_j = 0, _len = names.length; _j < _len; _j++) {
    sub = names[_j];
    leaf = subRegister(leaf, sub);
    dir = path.resolve(dir, sub);
  }
  dir = path.resolve(dir, name);
  if (registerMod(leaf, dir, name)) {
    return this;
  }
  registerDir(leaf, dir, name);
  return this;
};

module.exports = proto = {
  register: register,
  extend: mixable.merge
};
