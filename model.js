'use strict';

var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on('error', function (err) {
  console.log('Error ' + err);
});

function PUT_handler(req, res) {
    console.log('Received PUT request to url');
    console.log(req.url);
    res.end();
}

function GET_handler(req, res) {
  console.log('Received GET request to url');
  console.log(req.url);
  res.end('GET');
}

exports.putHandler = PUT_handler;
exports.getHandler = GET_handler;