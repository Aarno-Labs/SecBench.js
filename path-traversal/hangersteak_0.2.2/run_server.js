  const http = require("http");
  const hangersteak = require("hangersteak");
  const server = http.createServer((req, res) => {
    hangersteak(req, res);
  });
  server.listen(3006);