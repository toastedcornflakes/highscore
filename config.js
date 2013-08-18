'use strict';

var _ = require('underscore');
var assert = require('assert');

var config = {};

config.allowedGameNames = ['pokemon' , 'zelda'];

config.allowedPlayerNames = /^[a-z0-9]{2,32}$/i;
assert(_.isRegExp(config.allowedPlayerNames), 'Allowed player name should be a RegExp');

module.exports = config;
