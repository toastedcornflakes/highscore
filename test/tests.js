var host = '127.0.0.1:8888';
function request(url) {
  return require('superagent')(host+url);
}

var should = require('should');
require('../server'); // < this will launch the app

// insert mock data into config
require('../config').allowed_game_names = ['pokemon'];

describe('GET various invalid combinations', function() {
  describe('Unset player', function() {
    it('should return 404', function(done) {
      request('/pokemon/alphonse/best')
      .end(function(err, res){
        should.not.exist(err);
        res.should.have.status(404);      
        done();
      });
    });
  });
  describe('Invalid game', function(){
    it('should return 404', function(done){
      request('/neverheardofit/bob/best')
      .end(function(err, res){
        should.not.exist(err);
        res.should.have.status(400);
        done();
      });
    });
  });
  
});

