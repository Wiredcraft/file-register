// var debug = require('debug')('carcass:test');

// var should = require('should');
var Register = require('../');

describe('The Register class:', function() {

    it('should be a class', function() {
        Register.should.be.type('function');
    });

    it('should export the proto', function() {
        Register.should.have.property('proto').with.type('object');
        Register.proto.should.have.property('register').with.type('function');
        Register.proto.should.have.property('extend').with.type('function');
    });

    describe('An instance:', function() {

        var register = new Register();

        it('should be an instance', function() {
            register.should.be.type('object');
            register.should.be.instanceOf(Register);
        });

        it('should have some methods', function() {
            register.should.have.property('mixin').with.type('function');
            register.should.have.property('register').with.type('function');
            register.should.have.property('extend').with.type('function');
        });

    });

    describe('Get an instance with a function call:', function() {

        var register = Register();

        it('should be an instance', function() {
            register.should.be.type('object');
            register.should.be.instanceOf(Register);
        });

        it('should have some methods', function() {
            register.should.have.property('mixin').with.type('function');
            register.should.have.property('register').with.type('function');
            register.should.have.property('extend').with.type('function');
        });

    });

});
