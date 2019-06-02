const server = require("./lib/server");

// Define app container
const app = {};

app.init = () => {
  server.init();
}

app.init();