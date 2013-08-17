'use strict';

var http = require('http');
var model = require('./model.js');

function router(req, res) {
  res.setHeader('X-Powered-By', 'A fucking redhead');
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

module.exports.start = function startHttpServer(port) {
  http.createServer(router).listen(port);
  console.log('Server running at http://127.0.0.1:' + port);
};
