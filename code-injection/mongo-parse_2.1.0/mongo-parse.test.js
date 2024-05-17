test("Arbitrary code execution in mongo-parse", (done) => {
  expect.assertions(2);
  const fs = require("fs");
  const { execSync } = require("child_process")
  const sleep = require("sleep");
  const path = "./mongo-parse";
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  execSync(`node ${__dirname}/code.js`)
  setTimeout(() => {
    file_exist = fs.existsSync(path);
    expect(file_exist).toBe(true);
    fs.unlink(path, () => {
      done();
    });
  }, 2000);
});
