  const Server = require("fast-http");
  const { exec, execSync } = require("child_process");
  let srv = new Server(8080, "./", true);