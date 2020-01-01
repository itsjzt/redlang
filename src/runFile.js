const fs = require("fs");
const path = require("path");
const run = require("./run");

function runFile(fileUri) {
  fs.readFile(fileUri, (err, fileBuffer) => {
    if (err) {
      console.error(e);
      process.exit(1);
    }
    const fileData = fileBuffer.toString();
    run(fileData);
  });
}

module.exports = runFile;
