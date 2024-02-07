  var pkg = require('aso-server')
  const { sleep } = require("sleep");
  let server = pkg
     .onError(e => console.log(e))
     .onStop(() => {})
     .start('localhost', 3000, srv => {});