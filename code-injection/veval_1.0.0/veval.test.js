// This is vm.runInContext, which is pretty hard to do
// anything break out of the sandbox with. You can do
// basic prototype pollution, though
test("Arbitrary code execution in veval", () => {
  expect.assertions(2);
  const ve = require("veval");
  expect({}.polluted).toBe(undefined);
  try {
    ve({ hi: 0 }, "1 + (this.constructor.prototype.polluted = `yes`);");
  } catch (error) {}
  expect({}.polluted).toBe("yes");
});
