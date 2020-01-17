function scanToken(source = "") {
  const sourceTokens = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    const nextChar = source[index + 1];
    const singleCharSymbols = {
      "*": "STAR",
      "+": "PLUS",
      "-": "DASH",
      "/": "SLASH",
      "%": "PERCENT",
      "<": "ANGLE_LEFT",
      ">": "ANGLE_RIGHT",
      "!": "EXCLAMATION",
      "=": "EQUALS",
      ",": "COMMA",
      ";": "SEMICOLON",
      ".": "DOT",
      ":": "COLON",
      '"': "DOUBLE_QUOTE",
      ")": "PARENTHESIS_CLOSE",
      "(": "PARENTTHESIS_OPEN",
      "[": "BRACKET_OPEN",
      "]": "BRACKET_CLOSE",
      "{": "BRACES_OPEN",
      "}": "BRACES_CLOSE"
    };

    const doubleCharSymbol = {
      "<=": "GREATER_THAN_EQUAL",
      ">=": "LESS_THAN_EQUAL",
      "==": "DOUBLE_EQUAL",
      "!=": "EXCLAMATION_EQUAL"
    };

    if (char === "/" && nextChar === "/") {
      // comments before maths because command starts with // and divide symbol is /
    } else if (char === "/" && nextChar === "*") {
      // block level comment
    } else if (Object.keys(doubleCharSymbol).find(s => s === char + nextChar)) {
      // 2 char symbols before 1 char
    } else if (Object.keys(singleCharSymbols).find(s => s === char)) {
      // single char symbols
    } else if (char.match(/[a-z|A-Z]/)) {
      // keywords
    } else if (char.match(/\d/)) {
      // number
    } else {
      // syntax error
    }
  }

  return sourceTokens;
}

console.log(scanToken("+-*/\t\n"));
