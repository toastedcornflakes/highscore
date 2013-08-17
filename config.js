'use strict';

var _ = require('underscore');
var assert = require('assert');

var config = {};

config.allowed_game_names = ['pokemon' , 'zelda'];

config.allowed_player_names = /^[a-z0-9]{2,32}$/i;
assert(_.isRegExp(config.allowed_player_names), 'Allowed player name should be a RegExp');

module.exports = config;
