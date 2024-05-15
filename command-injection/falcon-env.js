const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { mockFrontend } = require('/home/eli/code/nodejs-agent/dist/test_util');
const {init} = require("/home/eli/code/nodejs-agent/dist/init")
const { readFile } = require("fs/promises")

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    console.log("constructor for %s", context.testPath)
    super(config, context);
    this.eventFile = context.testPath + ".events.jsonl"
  }

  async setup() {
    init({ eventFile: this.eventFile })
    await super.setup();
  }

  async teardown() {
    console.log("teardown")

    await super.teardown();
  }

  async handleTestEvent(event, state) {
  }
}

module.exports = CustomEnvironment