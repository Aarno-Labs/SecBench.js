
const {dirname, join, resolve} = require("path")
const fs = require("fs")

const onlyAN = /[^a-zA-Z0-9\-]/g

const fileReadOps = new Map([["fs.readFile", "path"],
                             ["fs.readFileSync", "path"],
                             ["fs.createReadStream", "path"]])

class FalconReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.falconSuccesses = []
    this.falconFails = []
  }

  getFalconResult(name, path) {
    const testName = name.replace(onlyAN, "_").toLowerCase()
    const testDir = dirname(path)

    const eventsFile = join(testDir, testName + ".events.json")
    const txt = fs.readFileSync(eventsFile, "utf-8")
    const events = txt.split("\n")
                      .filter(line => line.length > 0)
                      .map(line => JSON.parse(line))

    const readFiles = events.filter(event => [...fileReadOps.keys()].includes(event.call))
                             .map(event => event.concrete_args[fileReadOps.get(event.call)])
                             .map(p => resolve(testDir, p))

    const pathToFlag = resolve(testDir, "../flag.html")
    const success = readFiles.includes(pathToFlag)
    if(success) {
      this.falconSuccesses.push(name)
    } else {
      this.falconFails.push(name)
    }

    // XXX: Cleanup event files!
  }

  // Called when each test suite has been completed
  onTestResult(test, testResult, aggregatedResult) {
    console.log(`Finished test suite: ${test.path}`);
    for(const result of testResult.testResults) {
      this.getFalconResult(result.fullName, testResult.testFilePath)
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
