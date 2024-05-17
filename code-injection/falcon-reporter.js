const {readFileSync, existsSync, rmSync} = require('fs')
const {inspect} = require("util")


const susCalls = ["child_process.execSync",
                  "child_process.exec",
                  "child_process.spawn",
                  "child_process.spawnSync",
                  "process.binding.spawn_sync",
                  "fs.writeFileSync"]

class FalconReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.falconSuccesses = []
    this.falconFails = []
    this.toCleanup = []
  }

  getFalconResult(name, path) {
    let eventsFile = path + ".events.jsonl"
    this.toCleanup.push(eventsFile)
    const childFile = eventsFile + "_child"
    if(existsSync(childFile)) {
      eventsFile = childFile
      this.toCleanup.push(childFile)
    }

    const txt = readFileSync(eventsFile, {encoding: "utf-8"})
    const events = txt
                   .split("\n")
                   .filter(line => line.length > 0)
                   .map(line => JSON.parse(line))
                             // train events
    const susEvents = events.filter(e => e.outcome == "train")
                             // which are for a sus call
                            .filter(e => susCalls.includes(e.call))
                            // and don't originate in the test itself
                            .filter(e => e.library_trace[0].absPath != path)

    let expectedSusEvents = 0
    // Mobile-icon-resizer naturally calls convert
    if(name == "Arbitrary code execution in mobile-icon-resizer") {
      expectedSusEvents = 1
    }
    //console.log(susEvents.map(e => e.library_trace))
    if(susEvents.length == expectedSusEvents + 1) {
      this.falconSuccesses.push(name)
    } else {
      this.falconFails.push(name)
    }

    //console.log(inspect(susEvents))
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
    for (const file of this.toCleanup) {
      rmSync(file)
    }

    if (results.numTotalTests == 0) {
      process.exit(0)
    }

    if(results.numTotalTests != 1) {
      throw Error(`Expect a single test per test. Had ${results.numTotalTests}`)
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
