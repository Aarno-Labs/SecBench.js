  const http = require("http");
  const glance = require("glance");
  var g = glance({
    dir: "./",
    port: 8969,
    indices: [],
    hideindex: true,
    nodot: true,
    verbose: true,
  });
  http
    .createServer(function (req, res) {
      if (/^\/static\//.test(req.url)) {
        return g.serveRequest(req, res);
      }
    })
    .listen(5309);
  g.start();
  g.on("read", function (req) {
    console.dir(req);
  });
  g.on("error", function (req) {
    console.log("BAD!!!!");
    g.stop();
  });