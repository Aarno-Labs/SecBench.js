  const basicStatic = require("basic-static");
  const serveStatic = basicStatic({
    rootDir: process.cwd(),
    compress: true,
  });
  const http = require("http");
  const server = http.createServer(function (req, res) {
    serveStatic(req, res);
  });
  server.listen(8999);