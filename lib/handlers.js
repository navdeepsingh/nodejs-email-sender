const handlers = {};

handlers.send = (data, callback) => {
  callback(200);
}

handlers.notFound = (data, callback) => {
  callback(404);
}

module.exports = handlers;