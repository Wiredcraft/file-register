var debug, defineGetter, fs, isObject, isPrimitive, path, walk;

debug = require('debug')('carcass:fileRegister');

fs = require('fs');

path = require('path');

isPrimitive = function(value) {
  return (value == null) || (value === true) || (value === false) || (typeof value === 'string') || (typeof value === 'number');
};

isObject = function(value) {
  return !isPrimitive(value);
};


/**
 * Defines a getter, which is simply a require().
 *
 * @param {Object} leaf
 * @param {String} name
 * @param {String} modPath
 *
 * @return {undefined}
 */

defineGetter = function(leaf, name, modPath) {
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
};


/**
 * Recursively registers a directory.
 *
 * @param {Object} leaf
 * @param {String} dir
 * @param {String} name
 *
 * @return {undefined}
 */

walk = function(leaf, dir, name) {
  var filename, files, modPath, subPath, _i, _len;
  subPath = path.resolve(dir, name);
  try {
    modPath = require.resolve(subPath);
  } catch (_error) {}
  if (modPath != null) {
    return defineGetter(leaf, name, modPath);
  }
  try {
    files = fs.readdirSync(subPath);
  } catch (_error) {}
  if (files != null) {
    if (leaf[name] == null) {
      leaf[name] = {};
    }
    if (isPrimitive(leaf[name])) {
      return;
    }
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      filename = files[_i];
      walk(leaf[name], subPath, filename);
    }
  }
};

module.exports = {
  isPrimitive: isPrimitive,
  isObject: isObject,
  defineGetter: defineGetter,
  walk: walk
};
