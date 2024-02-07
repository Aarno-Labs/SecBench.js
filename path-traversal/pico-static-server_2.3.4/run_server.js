  const createServer = require("pico-static-server");
  const staticServer = createServer({
    defaultFile: "index.html",
    staticPath: ".",
    port: 8982,
  });