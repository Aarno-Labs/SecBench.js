  const ide = require("atropa-ide");
  const path = require("path");
  let port = 8884;
  let serverRoot = path.resolve(__dirname);
  ide.start(port, serverRoot);