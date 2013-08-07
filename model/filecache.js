'use strict';

var fs = require('fs');

var cache = {};

function readFile(path, callback) {
  if(cache.path) {
    return callback(undefined, cache.path);
  } else {
    console.log("Cache not hit for " + path + ", loading from disk");
    fs.readFile(path, function(err, file) {
      cache.path = file;
      callback(err, file);
    });
  }
}

module.exports.readFile = readFile;
