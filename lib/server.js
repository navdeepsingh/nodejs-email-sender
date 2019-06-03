/*
 *
 */
const http = require('http');
const url = require('url');
const handlers = require('./handlers');

const server = {};

server.http = http.createServer((req, res) => {
  // Defining Payload data
  const payload = {};
  // Get url path
  const parsedUrl = url.parse(req.url, true);
  let path = parsedUrl.pathname;
  path = path.replace(/^\/+|\/$/g, '');
  // Get query string
  const queryStringObject = parsedUrl.query;
  const method = req.headers;
  const headers = req.method;

  const data = {
    'path': path,
    'queryStringObject': queryStringObject,
    'method': method,
    'headers': headers
  }
  const chosenHandler = server.routes[path] !== undefined ? server.routes[path] : handlers.notFound;
  chosenHandler(data, (statusCode, payload) => {
    statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
    payload = typeof (payload) == 'object' ? payload : {};
    const payloadString = JSON.stringify(payload);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(payloadString);
    console.log('Returning the response: ', statusCode, payload, method, queryStringObject);
  });
});

server.init = () => {
  server.http.listen(process.env.PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server is listening up at port ${process.env.PORT}`);
  });
}

server.routes = {
  'send': handlers.send
}


module.exports = server;