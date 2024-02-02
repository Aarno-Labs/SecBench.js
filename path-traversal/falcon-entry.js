const fs = require("fs")
const {init} = require("/home/eli/code/nodejs-agent/dist/init")
fs.writeFileSync("/tmp/test_log.txt", process.env.FALCON_EVENTS_FILE)
init({eventFile: process.env.FALCON_EVENTS_FILE })
