'use strict';

var http = require('http');
var model = require('./model.js');
var config = require('./config.js');


function router(req, res) {
  // default handler is method not allowed
  var handler = function() {
    res.writeHead(405, {'Allow': 'GET, PUT'});
    res.end();
  };
  switch(req.method) {
    case 'PUT':
      handler = model.putHandler;
      break;
    case 'GET':
      handler = model.getHandler;
      break;
    default:
      console.log('Invalid http request');
  }
  handler(req, res);
}

http.createServer(router).listen(config.server_port);
console.log('Server running at http://127.0.0.1:' + config.server_port);
