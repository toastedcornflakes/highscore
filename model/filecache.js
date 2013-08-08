'use strict';

var fs = require('fs');

var cache = {};

function readFile(path, callback) {
  if(cache.path) {
    return callback(cache.path);
  } else {
    console.log("Cache not hit for " + path + ", loading from disk");
    fs.readFile(path, function(err, file) {
      if(err) {
        console.log('Required file not found, aborting...');
        console.log(__dirname + 'model/redis_put.lua');
        process.exit(-1);
      }
      cache.path = file;
      callback(file);
    });
  }
}

module.exports.readFile = readFile;
