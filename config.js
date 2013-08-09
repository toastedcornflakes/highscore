'use strict';

var _ = require('underscore');
var assert = require('assert');

var config = {};

config.allowed_game_names = ['pokemon' , 'zelda'];

config.allowed_player_names = /^[a-z0-9]+$/i;
config.server_port = 8888;

// check there's only alphanumeric in game_names
config.allowed_game_names.forEach(function(element){
  assert(element.match(/^[a-z0-9]+$/i), 'Invalid game name in config');
});
assert(config.server_port >= 1 && config.server_port <= 65535);
assert(_.isRegExp(config.allowed_player_names), 'Allowed player name should be a RegExp');

module.exports = config;
