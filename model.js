'use strict';

var config = require('./config.js');
var fileCache = require('./model/filecache.js');
var redis = require('redis');
var redisClient = redis.createClient();

var BEST_EVER = '_worldwide_best';
var BEST = 'best';
var LATEST = 'latest';


redisClient.on('error', function (err) {
  console.log('Error ' + err);
});


// save to redis
function save_new_score(game, player, score, save_callback) { 
  // set latest, get best saved and replace it by new score if it's is better
  // using redis eval and lua magic to make atomic operations
  fileCache.readFile('lua/put_new_highscore.lua', function(file){
    var lua_redis_update_script = file;
    var key_worldwide = ['score', game, BEST_EVER].join('::');
    var key_prefix = ['score', game, player, ''].join('::');
    var key_best = key_prefix + BEST;
    var key_latest = key_prefix + LATEST;

    // invoke redis with lua script
    redisClient.eval([lua_redis_update_script, 3, key_best, key_latest, key_worldwide, score], save_callback);
  });
}

function PUT_handler(req, res) {
  console.log('Receiving PUT request to ' + req.url);
  
  // splitting the url to get an array ['', game_name, play_name, score]
  var path = req.url.split('/', 4);
  
  // check if input is sane
  var error_message = '';
  if (path.length < 4) {
    error_message = 'Not enough parameters';
  } else if (path[0] !=='') {
    error_message = 'Invalid request';
  } else if (config.allowed_game_names.indexOf(path[1]) == -1) {
    error_message = 'Inexistent game name';
  } else if (!path[2].match(config.allowed_player_names)) {
    error_message = 'Invalid player name';
  } else if (!path[3].match(/^[\d]+$/)) {
    error_message = 'Score isn\'t integer';
  }
  
  if (error_message) {
    console.log('Error: ' + error_message);
    res.writeHead(400);
    res.end(error_message);
    return;
  }
  
  var game = path[1];
  var player = path[2];
  // specify the radix to work around octal behavior of parseInt()
  var score = parseInt(path[3], 10);
  save_new_score(game, player, score, function (err) {
    console.log('Saved to redis');
    if(err) {
      console.log('Redis error: ' + err);
      res.writeHead(500);
    } else {
      res.writeHead(201);
    }
    res.end();
  });
}


function presentError(res, error_message) {
  console.log('Error: ' + error_message);
  res.writeHead(400);
  res.end(error_message);
}

function servePlayerScore(res, game, player, verb) {
  var key = ['score', game, player, verb].join('::');
  
  redisClient.get(key, function(err, reply) {
    if (err || isNaN(reply)) {
      res.writeHead(500);
      res.end('Internal server error');
    } else if (reply) {
      res.writeHead(200);
      res.end(reply);
    } else {
      res.writeHead(404);
      res.end('Player not found');
    }
  });
}


function serveWorldwideBest(res, game) {
  var key = ['score', game, BEST_EVER].join('::');
  redisClient.get(key, function(err, reply) {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
    } else if (reply || !isNaN(reply)) {
      res.writeHead(200);
      res.end(reply);
    } else {
      res.writeHead(404);
      res.end('Score not found');
    }
  });
}


String.prototype.removeTrailing = function(what) {
  if (this.slice(-what.length) === what) {
    return this.slice(0, -what.length);
  } else {
    return this;
  }
};


function GET_handler(req, res) {
  console.log('Received GET request to url');
  console.log(req.url);
  var path = req.url.removeTrailing('/').split('/', 4);

  /**
   * error check for either 
   * /game/worldwide
   * or
   * /game/player/[best|latest]
   */
  var error_message = '';
  if (path.length == 4 || path.length == 3) {
    // common checks
    if (path[0] !=='') {
      return presentError(res, 'Invalid request');
    }
    if (config.allowed_game_names.indexOf(path[1]) == -1) {
      return presentError(res, 'Inexistent game name');
    }
    if(path.length == 3) {
      // checks for worldwide
      if(path[2] === 'worldwide') {
        return serveWorldwideBest(res, path[1]);
      }
    } else {
      // checks for single player
      if (!path[2].match(config.regex_allowed_player_names)) {
        return presentError(res, 'Invalid player name');
      }
      if (path[3] !== BEST && path[3] !== LATEST) {
        return presentError(res, 'Invalid [best|latest] keyword');
      }
      // All done, serve the data
      return servePlayerScore(res, path[1], path[2], path[3]);      
    }
  } else {
    return presentError(res, 'Invalid number of parameters');
  }
}


exports.putHandler = PUT_handler;
exports.getHandler = GET_handler;
