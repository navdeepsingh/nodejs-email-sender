/*
 *
 */
const http = require('http');

const server = {};

server.http = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end();
  console.log('Hello World');

});

server.init = () => {
  server.http.listen('3000', () => {
    console.log('\x1b[32m%s\x1b[0m', `Server is listening up at port 3000`);
  });
}

module.exports = server;