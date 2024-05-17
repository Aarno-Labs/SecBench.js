test("Arbitrary code execution in mixin-pro", () => {
  expect.assertions(2);
  const fs = require("fs");
  const { execSync } = require("child_process")
  const sleep = require("sleep");
  const path = "./mixin-pro";
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  execSync(`node ${__dirname}/code.js`)
  sleep.sleep(2)

  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
