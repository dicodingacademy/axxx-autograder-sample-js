const http = require('http');

const server = http.createServer((req, res) => {
  return res.end('Hello World!');
});

server.listen(9000);