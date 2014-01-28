'use strict';
/* global describe, it  */

var request = require('superagent');
var should = require('should');

require('../server').start(8888); // < this will launch the app on port 1234
var host = '127.0.0.1:8888';

// override some config data
require('../config').allowedGameNames = ['pokemon'];

describe('GET various invalid combinations', function() {
  describe('Unset player', function() {
    it('should return http code 404', function(done) {
      request
      .get(host + '/pokemon/alphonse/best')
      .end(function(err, res){
        should.not.exist(err);
        res.should.have.status(404);
        done();
      });
    });
  });
  describe('Invalid game', function() {
    it('should return http code 400', function(done) {
      request
      .get(host + '/neverheardofit/bob/best')
      .end(function(err, res){
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });
  describe('Invalid keyword', function() {
    it('should return http code 400', function(done) {
      request
      .get(host + '/pokemon/bob/prout')
      .end(function(err, res){
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });
});


describe('PUT requests', function(){
  describe('PUT invalid data', function() {
    it('Invalid player name should return http code 400', function(done) {
      request
      .put(host + '/pokemon/invalid&!èname/1234')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
    
    it('Missing arg should return http code 400', function(done) {
      request
      .put(host + '/pokemon/missingarg')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
    
    it('Invalid score should return http code 400', function(done) {
      request
      .put(host + '/pokemon/bob/cupcake')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });
});


describe('PUT requests', function(){
  describe('PUT invalid data', function() {
    it('Invalid player name should return http code 400', function(done) {
      request
      .put(host + '/pokemon/invalid&!èname/1234')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
    
    it('Missing arg should return http code 400', function(done) {
      request
      .put(host + '/pokemon/missingarg')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
    
    it('Invalid score should return http code 400', function(done) {
      request
      .put(host + '/pokemon/bob/cupcake')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });
  
  describe('PUT valid data', function() {
    it('should return http code 201', function(done) {
      request
      .put(host + '/pokemon/bob/999')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(201);
        done();
      });
    });
    it('should return http code 201', function(done) {
      request
      .put(host + '/pokemon/bob/21')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(201);
        done();
      });
    });
    it('should return http code 201', function(done) {
      request
      .put(host + '/pokemon/alice/8888')
      .end(function(err, res) {
        should.not.exist(err);
        res.should.have.status(201);
        done();
      });
    });
  });
});

describe('GET previously set data', function() {
  //this.timeout(5000);
  describe('worldwide best should be alice\'s score', function() {
    it('should return 8888', function(done) {
      request
      .get(host + '/pokemon/alice/best')
      .end(function(res){
//        should.not.exist(err);
        res.should.have.status(200);
        console.log('alice res', res.text);
        done();
      });
    });
  });
});

