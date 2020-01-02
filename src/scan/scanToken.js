const tokens = require("./scan/tokens");

function scanToken(source) {
  const sourceTokens = [];
  let i = 0;
  do {
    const c = source[i];
    switch (c) {
      case "(":
        sourceTokens.push(tokens.LEFT_PAREN);
        break;
      case ")":
        sourceTokens.push(tokens.RIGHT_PAREN);
        break;
      case "{":
        sourceTokens.push(tokens.LEFT_BRACE);
        break;
      case "}":
        sourceTokens.push(tokens.RIGHT_BRACE);
        break;
      case ",":
        sourceTokens.push(tokens.COMMA);
        break;
      case ".":
        sourceTokens.push(tokens.DOT);
        break;
      case "-":
        sourceTokens.push(tokens.MINUS);
        break;
      case "+":
        sourceTokens.push(tokens.PLUS);
        break;
      case ";":
        sourceTokens.push(tokens.SEMICOLON);
        break;
      case "*":
        sourceTokens.push(tokens.STAR);
        break;

      // case "!":
      //   sourceTokens.push(match("=") ? tokens.BANG_EQUAL : tokens.BANG);
      //   break;
      // case "=":
      //   sourceTokens.push(match("=") ? tokens.EQUAL_EQUAL : tokens.EQUAL);
      //   break;
      // case "<":
      //   sourceTokens.push(match("=") ? tokens.LESS_EQUAL : tokens.LESS);
      //   break;
      // case ">":
      //   sourceTokens.push(match("=") ? tokens.GREATER_EQUAL : tokens.GREATER);
      //   break;
      case "/":
        sourceTokens.push(tokens.SLASH);
        break;
      default:
        sourceTokens.push("Unkonwn token " + String.fromCharCode(c));
    }
  } while (i++ < source.length);

  return sourceTokens;
}
module.exports = scanToken;
