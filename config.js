'use strict';

var config = {};

config.allowed_game_names = ['pokemon' , 'zelda'];

// check there's only alphanumeric in game_names
config.allowed_game_names.forEach(function(element){
  if (!element.match(/^[a-z0-9]+$/i)) {
    console.log('Invalid game name in config. Aborting...');
    process.exit(-1);
  }
});

config.regex_allowed_player_names = /^[a-z0-9]+$/i;
config.server_port = 8888;

module.exports = config;
