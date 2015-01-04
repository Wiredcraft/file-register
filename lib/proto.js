var fs, mixable, path, proto, register, utils,
  __slice = [].slice;

fs = require('fs');

path = require('path');

utils = require('./utils');

mixable = require('mixable-object');


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
  var dir, filename, files, leaf, name, names, root, sub, _i, _j, _k, _len, _len1;
  root = arguments[0], names = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), name = arguments[_i++];
  leaf = this;
  dir = path.resolve(root);
  if (name == null) {
    try {
      files = fs.readdirSync(dir);
    } catch (_error) {}
    if (files == null) {
      return this;
    }
    for (_j = 0, _len = files.length; _j < _len; _j++) {
      filename = files[_j];
      utils.walk(leaf, dir, filename);
    }
    return this;
  }
  for (_k = 0, _len1 = names.length; _k < _len1; _k++) {
    sub = names[_k];
    if (utils.isPrimitive(leaf[sub])) {
      leaf[sub] = {};
    }
    leaf = leaf[sub];
    dir = path.resolve(dir, sub);
  }
  utils.walk(leaf, dir, name);
  return this;
};

module.exports = proto = {
  register: register,
  extend: mixable.merge
};
