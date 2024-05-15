const {readFileSync} = require('fs')
const {inspect} = require("util")
const {argsFromJSON} = require("/home/eli/code/nodejs-agent/dist/argument_learning")


function countCommands(node) {
  if (typeof node == "string" || typeof node == "boolean" || node == undefined) {
    return 0
  }

  if (Array.isArray(node)) {
    return node.map(countCommands).reduce((a, b) => a + b)
  }

  let n = 0

  if(node.type == "Command") {
    n += 1
  }

  for (prop in node) {
    if (prop == "loc") {
      continue
    }

    n += countCommands(node[prop])
  }

  return n
}

class FalconReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.falconSuccesses = []
    this.falconFails = []
  }

  getFalconResult(name, path) {
    const eventsFile = path + ".events.jsonl"
    const txt = readFileSync(eventsFile, {encoding: "utf-8"})
    const events = txt
                   .split("\n")
                   .filter(line => line.length > 0)
                   .map(line => JSON.parse(line))
    const execs = events.filter(e => e.outcome == "train")
                        .filter(e => e.call == "child_process.exec")
    execs.forEach(e => e.tracked_args = argsFromJSON(e.tracked_args))

    if(execs.length != 1) {
      console.log("WRONG NUMBER OF EXECS: %s", inspect(execs))
      throw Error("Wrong number of execs?")
    }

    const execEvent = execs[0]

    if(!execEvent.kind == "IndependentArgs") {
      throw Error("Non-independent args in exec: %s", inspect(execEvent.tracked_args))
    }

    const learnedCommand = execEvent.tracked_args.args.get("command")
    const nSubcommands = countCommands(learnedCommand)

    //console.log(inspect(learnedCommand, false, null, true))
    console.log("Got %s commands", nSubcommands)
    if(nSubcommands > 1) {
      this.falconSuccesses.push(name)
    } else {
      this.falconFails.push(name)
    }

    console.log("Got %s events", events.length)
  }

  // Called when each test suite has been completed
  onTestResult(test, testResult, aggregatedResult) {
    console.log(`Finished test suite: ${test.path}`);
    for(const result of testResult.testResults) {
      try {
        this.getFalconResult(result.fullName, testResult.testFilePath)
      } catch (e) {
        console.log(e)
      }
    }

    console.log(`Passed: ${testResult.numPassingTests}. Failed: ${testResult.numFailingTests}.`);
  }

  // Called when all tests have completed running
  onRunComplete(test, results) {
    if(results.numTotalTests != 1) {
      throw Error("Expect a single test per test")
    }
    console.log('\n---------------------FALCON RESULTS----------------------');
    console.log('Falcon successes: [%s/%s]', this.falconSuccesses.length, results.numTotalTests)
    for (const name of this.falconSuccesses) {
      // Gotta love chatGPT for color codes!
      console.log('\x1b[30m\x1b[42m%s\x1b[0m', ' PASS ', name);
    }
    for (const name of this.falconFails) {
      console.log('\x1b[30m\x1b[41m%s\x1b[0m', ' FAIL ', name);
    }
    console.log('\n----------------------------------------------------------');
    if(this.falconSuccesses.length != 1) {
      process.exit(1)
    } else {
      process.exit(0)
    }
  }
}

module.exports = FalconReporter;
