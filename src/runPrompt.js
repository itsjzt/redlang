const run = require("./run");

function runPrompt() {
  process.stdout.write("> ");
  readStdin(run);
}

function readStdin(callback) {
  process.stdin.on("data", lineBuffer => callback(lineBuffer.toString()));
}

module.exports = runPrompt;
