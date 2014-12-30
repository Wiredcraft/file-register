var extend, fs, mixin, path, register, utils,
  __slice = [].slice;

fs = require('fs');

path = require('path');

mixin = require('mixable-object').mixin;

utils = require('./utils');


/**
 * Register.
 *
 * See tests for details.
 *
 * @param root
 * @param *name
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


/**
 * Extend with another register.
 *
 * @param lib
 * @param *name
 *
 * @return {this}
 */

extend = function() {
  var lib, name, names, _i, _len;
  lib = arguments[0], names = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  for (_i = 0, _len = names.length; _i < _len; _i++) {
    name = names[_i];
    if (lib[name] == null) {
      return;
    }
    if (this[name] == null) {
      this[name] = {};
    }
    if (utils.isObject(this[name])) {
      mixin.call(this[name], lib[name]);
    }
  }
  return this;
};

module.exports = {
  register: register,
  extend: extend
};
