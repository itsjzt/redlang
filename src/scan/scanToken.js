const { maths } = require("../scan/maths");
const { whitespaces } = require("../scan/whitespaces");

function scanToken(source) {
  const sourceTokens = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    console.log({ index, length: source.length });

    const mathChar = maths({ char, index, source });
    if (mathChar) {
      console.log(mathChar);
      index = mathChar.index;
      sourceTokens.push(mathChar.token);
      continue;
    }

    const whitespaceChar = whitespaces({ char, index, source });
    if (whitespaceChar) {
      console.log(mathChar);
      index = whitespaceChar.index;
      // no token is generated for whitespaces
    }
  }

  return sourceTokens;
}

console.log(scanToken("+-*/\t\n"));

module.exports = scanToken;
