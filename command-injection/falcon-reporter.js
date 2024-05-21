const {readFileSync} = require('fs')
const {inspect} = require("util")
const {argsFromJSON} = require("/home/eli/code/nodejs-agent/dist/argument_learning")


function getCommands(node) {
  const out = []
  function rec(node) {
    if (typeof node == "string" || typeof node == "boolean" || node == undefined) {
      return
    }

    if (Array.isArray(node)) {
      return node.forEach(rec)
    }

    if(node.type == "Command") {
      out.push(node)
    }

    for (prop in node) {
      if (prop == "loc") {
        continue
      }

      rec(node[prop])
    }
  }

  rec(node)
  return out
}

function isTouchFile(command, file) {
  return command.name.type == "Word" &&
  command.name.text == "touch" &&
  command.suffix[0].type == "Word" &&
  command.suffix[0].text.kind == "OneOfValue" &&
  command.suffix[0].text.possibilities.includes(file)
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
                        .filter(e => e.call.startsWith("child_process.exec"))
    execs.forEach(e => e.tracked_args = argsFromJSON(e.tracked_args))

    const testFile = name.replace("Command Injection in ", "").
                          replace("Remote code execution in ", "")

    for(const execEvent of execs) {
      if(!execEvent.kind == "IndependentArgs") {
        throw Error("Non-independent args in exec: %s", inspect(execEvent.tracked_args))
      }


      const learnedScript = execEvent.tracked_args.args.get("command")
      const commands = getCommands(learnedScript)
      console.log("commands: %s", inspect(commands, false, null, true))

      for (const command of commands) {
        if (isTouchFile(command, testFile)) {
          this.falconSuccesses.push(name)
          return
        }
      }
    }

    console.log(inspect(events.filter(e => e.outcome == "train" && e.call.startsWith("child_process"))))
    console.log("Testfile is %s", testFile)

    this.falconFails.push(name)

    // XXX: Cleanup event files!
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
