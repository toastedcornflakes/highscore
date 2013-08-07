var http = require('http');

var port = 8888;

function request_handler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}

http.createServer(request_handler).listen(port, '127.0.0.1');
console.log('Server running at http://127.0.0.1:' + port);