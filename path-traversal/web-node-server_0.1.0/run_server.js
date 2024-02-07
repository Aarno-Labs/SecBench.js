let config = {
  localhost: {
    backend: __dirname + "/",
    frondend: __dirname + "/",
    baseTemp: "index.html",
  },
};
const pkg = require("web-node-server");
pkg.start(config);