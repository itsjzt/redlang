const tokens = require("./scan/tokens");

function scanToken(source) {
  const sourceTokens = [];
  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const nextChar = source[i + 1];
    switch (char) {
      case "(":
        sourceTokens.push(tokens.LEFT_PAREN);
        i++;
        break;
      case ")":
        sourceTokens.push(tokens.RIGHT_PAREN);
        i++;
        break;
      case "{":
        sourceTokens.push(tokens.LEFT_BRACE);
        i++;
        break;
      case "}":
        sourceTokens.push(tokens.RIGHT_BRACE);
        i++;
        break;
      case ",":
        sourceTokens.push(tokens.COMMA);
        i++;
        break;
      case ".":
        sourceTokens.push(tokens.DOT);
        i++;
        break;
      case "-":
        sourceTokens.push(tokens.MINUS);
        i++;
        break;
      case "+":
        sourceTokens.push(tokens.PLUS);
        i++;
        break;
      case ";":
        sourceTokens.push(tokens.SEMICOLON);
        i++;
        break;
      case "*":
        sourceTokens.push(tokens.STAR);
        i++;
        break;

      case "!":
        sourceTokens.push(nextChar === "=" ? tokens.BANG_EQUAL : tokens.BANG);
        break;
      case "=":
        sourceTokens.push(nextChar === "=" ? tokens.EQUAL_EQUAL : tokens.EQUAL);
        break;
      case "<":
        sourceTokens.push(nextChar === "=" ? tokens.LESS_EQUAL : tokens.LESS);
        break;
      case ">":
        sourceTokens.push(
          nextChar === "=" ? tokens.GREATER_EQUAL : tokens.GREATER
        );
        break;
      case "/":
        if (nextChar !== "/") {
          sourceTokens.push(tokens.SLASH);
          i++;
        } else {
          // skip till the end of line for comment
          //   i++;
        }
        break;
      default:
        sourceTokens.push("Unkonwn token " + String.fromCharCode(char));
    }
  }

  return sourceTokens;
}
module.exports = scanToken;
