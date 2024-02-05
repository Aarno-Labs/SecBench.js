
const path = require("path")

function addFalconToOptions(options) {
  if (!options.env) {
    options.env = {...process.env}
  }

  if (!options.env.NODE_OPTIONS) {
    options.env.NODE_OPTIONS = ""
  }

  // Load an entry point that just calls init, no args. All args will have been written to the worker
  // config file
  options.env.NODE_OPTIONS += ` --require ${path.join(__dirname, "falcon-entry.js")}`

  return options
}

const handler = {
  apply(target, self, rawArgs) {
    let [command, options, callback] = rawArgs

    // Javascript lets you pass callback in position 2
    if (typeof options == "function") {
      callback = options
      options = {}
    }

    options = addFalconToOptions(options)

    const callArgs = [command, options, callback]
    return Reflect.apply(target, self, callArgs)
  }
}

const onlyAN = /[^a-zA-Z0-9\-]/g

beforeEach(async () => {
  // Set exec in the test to run falcon
  let oldExec = require("child_process").exec;
  require("child_process").exec = new Proxy(oldExec, handler)
  const testDir = path.dirname(expect.getState().testPath)
  const testName = expect.getState().currentTestName.replace(onlyAN, "_").toLowerCase()
  const eventsFile = path.join(testDir, testName + ".events.json")

  process.env.FALCON_EVENTS_FILE = eventsFile
})
