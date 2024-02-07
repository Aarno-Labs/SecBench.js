  const pkg = require("node-http-server");
  pkg.deploy({
    port: 8986,
    root: __dirname,
  });