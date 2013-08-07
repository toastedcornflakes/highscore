'use strict';

var config = require('./config.js');
var fileCache = require('./model/filecache.js')
var redis = require('redis');
var redisClient = redis.createClient();

var BEST = 'best';
var LATEST= 'latest';


redisClient.on('error', function (err) {
  console.log('Error ' + err);
});


// looks like 'score::pokemon::bob::'
function create_redis_key_prefix(game, player) {
  return ['score', game, player, ''].join('::');
}


function PUT_handler(req, res) {
  console.log('Received PUT request to url');
  console.log(req.url);
  
  // splitting the url to get an array ['', game_name, play_name, score]
  var path = req.url.split('/', 4);
  
  // check if input is sane
  var error_message = '';
  if (path.length < 4) {
    error_message = 'Not enough parameters';
  } else if (path[0] != '') {
    error_message = 'Invalid request';
  } else if (config.allowed_game_names.indexOf(path[1]) == -1) {
    error_message = 'Inexistent game name';
  } else if (!path[2].match(config.regex_allowed_player_names)) {
    error_message = 'Invalid player name';
  } else if (!path[3].match(/^[\d]+$/)) {
    error_message = 'Score isn\'t integer';
  }
  
  if (error_message){
    console.log('Error: ' + error_message);
    res.writeHead(400);
    res.end(error_message);
    return;
  } 
  
  var game = path[1];
  var player = path[2];
  // specify the radix to work around octal behavior of parseInt()
  var score = parseInt(path[3], 10);
  // saving to redis
  var key_prefix = create_redis_key_prefix(game, player);
  
  // set latest, get best saved and replace it by new score if it's is better
  // using redis eval and lua magic to make atomic operations
  fileCache.readFile('lua/put_new_highscore.lua', function(err, file){
    if(err) {
      console.log('Required file not found, aborting...');
      console.log(__dirname + 'model/redis_put.lua');
      process.exit(-1);
    }
    var lua_redis_update_script = file;
    // args of eval(): [script, number of keys, key1, key2..., arg to script]
    redisClient.eval([lua_redis_update_script, 2, key_prefix + BEST, key_prefix + LATEST, score], 
    function (err) {
      if(err) {
        console.log('Redis error: ' + err);
        res.writeHead(500);
      } else {
        res.writeHead(201);
      }
      res.end();
    });
  });
}

function GET_handler(req, res) {
  console.log('Received GET request to url');
  console.log(req.url);
  var path = req.url.split('/', 4);
  
  // check if input is sane
  var error_message = '';
  if (path.length < 4) {
    error_message = 'Not enough parameters';
  } else if (path[0] != '') {
    error_message = 'Invalid request';
  } else if (config.allowed_game_names.indexOf(path[1]) == -1) {
    error_message = 'Inexistent game name';
  } else if (!path[2].match(config.regex_allowed_player_names)) {
    error_message = 'Invalid player name';
  } else if (path[3] !== BEST && path[3] !== LATEST) {
    error_message = 'Invalid [best|latest] keyword';
  }
  
  if (error_message) {
    console.log('Error: ' + error_message);
    res.writeHead(400);
    res.end(error_message);
    return;
  }
  
  var game = path[1];
  var player = path[2];
  var verb = path[3] === BEST ? BEST : LATEST;
  redisClient.get(create_redis_key_prefix(game, player) + verb, function(err, reply) {
    if (err || isNaN(reply)) {
      res.writeHead(500);
      res.end('Internal server error');
    } else if (reply) {
      res.writeHead(200);
      res.end(reply);
    } else {
      res.writeHead(404)
      res.end('Player not found');
    }
  });
}


exports.putHandler = PUT_handler;
exports.getHandler = GET_handler;
