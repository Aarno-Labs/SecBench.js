test("Arbitrary code execution in jsen", () => {
  expect.assertions(2);
  const fs = require("fs");
  const { execSync } = require("child_process")
  const sleep = require("sleep");
  const path = "./jsen";
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  // For whatever reason, this doesn't actually work when run directly under jest
  execSync(`node ${__dirname}/code.js`)
  sleep.sleep(2)
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
