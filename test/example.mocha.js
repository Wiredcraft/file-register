var debug = require('debug')('carcass:test');

var should = require('should');
var path = require('path');
var Register = require('../');

describe('The example:', function() {

  it('should work', function() {
    var example = require('./example');

    // It is a map reflecting the file structure.
    example.should.be.type('object');

    // The key is the filename and value is what the file exports.
    example.should.have.property('utils').with.type('object');
    example.utils.should.have.property('lorem').with.type('function');

    // Nested directories are registered recursively.
    example.should.have.property('models').with.type('object');
    example.models.should.have.property('User').with.type('function');

    // Things are handled with `require()` so a directory with an index
    // becomes whatever the index exports.
    example.should.have.property('views').with.type('string');
  });

});

describe('Use the class:', function() {

  it('should work', function() {
    var example = new Register();
    example.register(path.resolve(__dirname, 'example/lib'));

    // It does the same thing as above.
    example.should.be.type('object');
    example.should.have.property('models').with.type('object');
    example.models.should.have.property('User').with.type('function');
    example.should.have.property('views').with.type('string');
    example.should.have.property('utils').with.type('object');
    example.utils.should.have.property('lorem').with.type('function');
  });

});

describe('Put everything in lib:', function() {

  it('should work', function() {
    var example = new Register();

    // Any argument after the path will be used as 2 things: 1) the path
    // fragments and 2) the map keys.
    example.register(path.resolve(__dirname, 'example'), 'lib');

    example.should.be.type('object');
    example.should.have.property('lib').with.type('object');

    // Things are in `example.lib` now.
    example.lib.should.have.property('models').with.type('object');
    example.lib.models.should.have.property('User').with.type('function');
    example.lib.should.have.property('views').with.type('string');
    example.lib.should.have.property('utils').with.type('object');
    example.lib.utils.should.have.property('lorem').with.type('function');
  });

});

describe('Register one thing:', function() {

  it('should work', function() {
    var example = new Register();

    // If you only want one of the things.
    example.register(path.resolve(__dirname, 'example', 'lib'), 'models');

    example.should.be.type('object');
    example.should.have.property('models').with.type('object');
    example.models.should.have.property('User').with.type('function');

    // Now you don't have the other things.
    example.should.not.have.property('views');
    example.should.not.have.property('utils');
  });

});

describe('Register one thing and put it in lib:', function() {

  it('should work', function() {
    var example = new Register();

    // Things can also be nested.
    example.register(path.resolve(__dirname, 'example'), 'lib', 'models');

    example.should.be.type('object');
    example.should.have.property('lib').with.type('object');
    example.lib.should.have.property('models').with.type('object');
    example.lib.models.should.have.property('User').with.type('function');

    // And you still don't have the other things.
    example.should.not.have.property('views');
    example.should.not.have.property('utils');
    example.lib.should.not.have.property('views');
    example.lib.should.not.have.property('utils');
  });

});

describe('Extend with another register:', function() {

  it('should work', function() {
    var example = new Register();
    var another = new Register();
    another.register(path.resolve(__dirname, 'example/lib'));

    // Say example already has something.
    example.models = {
      Data: function() {}
    };

    // Extend.
    example.extend(another);

    // Now it has everything another has.
    example.should.be.type('object');
    example.should.have.property('models').with.type('object');
    example.models.should.have.property('Data').with.type('function');
    example.models.should.have.property('User').with.type('function');
    example.should.have.property('views').with.type('string');
    example.should.have.property('utils').with.type('object');
    example.utils.should.have.property('lorem').with.type('function');
  });

});

describe('Selectively extend with another register:', function() {

  it('should work', function() {
    var example = new Register();
    var another = new Register();
    another.register(path.resolve(__dirname, 'example/lib'));

    // Say example already has something.
    example.models = {
      Data: function() {}
    };

    // Extend.
    example.extend(another, 'models');

    // Now it has everything another has.
    example.should.be.type('object');
    example.should.have.property('models').with.type('object');
    example.models.should.have.property('Data').with.type('function');
    example.models.should.have.property('User').with.type('function');
    example.should.not.have.property('views');
    example.should.not.have.property('utils');
  });

});
