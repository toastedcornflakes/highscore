'use strict';

/**
 * A simple file loader and memoizer based on fs.readFile()
 * The file will stay in memory until node is stopped, or until
 * it's modified on the filesystem (watched with fs.)
 */

var fs = require('fs');
var _ = require('underscore');

var cache = {};

function readFile(path, callback) {
  if(!_.isString(path)) {
    return;
  }
  if(cache.path) {
    return callback(cache.path);
  } else {
    //console.log('Cache not hit for ' + path + ', loading from disk');
    fs.readFile(path, function(err, file) {
      if(err) {
        console.log('Required file not found, aborting...');
        process.exit(-1);
      }
      cache.path = file;
      callback(file);
    });
    
    //console.log('Adding ' + path + ' to watch for changes and invalidate the cache when needed');
    fs.watch(path, {persistent: false}, function(event, filename) {
      // since filename is null on OS X, invalidate the whole cache
      // instead of just the file
      if(filename) {
        console.log('Invalidating ' + filename);  
        delete cache.filename;
      } else {
        console.log('Invalidating the whole cache');
        cache = {};
      }
    });
  }
}

module.exports.readFile = readFile;
