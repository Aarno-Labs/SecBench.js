//https://github.com/pocketly/node-sanitize/commit/4fd57530367ea9f2570b1e57d1a1a32e7f5d644f#
test("ReDos in sanitize", () => {
    const measureTime = require("./utils").measureTime;
    const sanitize = require('sanitize');
    const sanitizer = sanitize();
 
    let t = measureTime(function () {       
       sanitizer.my.url("a" + ("." + "a".repeat(55)).repeat(4) + "#");
    });
  
    let time = t[0] + t[1] / 1000000000;
    expect(time).toBeGreaterThan(1);
  });
  