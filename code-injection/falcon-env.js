const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const {init} = require("/home/eli/code/nodejs-agent/dist/init")

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.eventFile = context.testPath + ".events.jsonl"
  }

  async setup() {
    init({ eventFile: this.eventFile })
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  async handleTestEvent(event, state) {
  }
}

module.exports = CustomEnvironment