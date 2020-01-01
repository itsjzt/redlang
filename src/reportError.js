function reportError(lineNumber, where, message) {
  console.log("[line " + lineNumber + "] Error" + where + ": " + message);
}

module.exports = reportError;
