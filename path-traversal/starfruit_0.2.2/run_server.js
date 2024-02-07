  var pkg = require('starfruit');
  const { sleep } = require("sleep");
  app = pkg();
  app.listen(8080);
  sleep(2);