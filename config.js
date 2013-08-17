'use strict';

var _ = require('underscore');
var assert = require('assert');

var config = {};

config.allowed_game_names = ['pokemon' , 'zelda'];

config.allowed_player_names = /^[a-z0-9]{2,32}$/i;

// check there's only alphanumeric in game_names
config.allowed_game_names.forEach(function(element){
  assert(element.match(/^[a-z0-9]+$/i), 'Invalid game name in config');
});
assert(_.isRegExp(config.allowed_player_names), 'Allowed player name should be a RegExp');

module.exports = config;
