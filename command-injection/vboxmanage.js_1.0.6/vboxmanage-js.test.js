test("Command Injection in vboxmanage", () => {
  expect.assertions(2);
  const VBox = require("vboxmanage.js");
  const fs = require("fs");
  const path = "./vboxmanage";
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      console.log("File removed:", path);
    }
  } catch (err) {
    console.error(err);
  }
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  return VBox.start(";touch vboxmanage;")
    .then(function () {})
    .catch(() => {})
    .finally(() => {
      file_exist = fs.existsSync(path);
      expect(file_exist).toBe(true);
      fs.unlink(path, function (err) {});
    });
});
