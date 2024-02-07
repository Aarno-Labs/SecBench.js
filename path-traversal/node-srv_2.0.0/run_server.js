  let Server = require("node-srv");
  let srv = new Server(
    {
      port: 8080,
      root: "./",
      logs: true,
    },
    function () {}
  );