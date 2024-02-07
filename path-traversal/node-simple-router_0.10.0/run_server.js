  const Router = require("node-simple-router");
  const http = require("http");
  let router = new Router({
    static_route: process.cwd(),
    cgi_dir: "cgi-bin",
    use_nsr_session: false,
    default_home: [],
  });
  const server = http.createServer(router);
  server.listen(8985);