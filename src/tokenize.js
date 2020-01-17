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
  "+=": "PLUS_EQUAL",
  "-=": "DASH_EQUAL",
  "*=": "STAR_EQUAL",
  "/=": "SLASH_EQUAL",
  "!=": "EXCLAMATION_EQUAL"
};

function scanToken(source = "") {
  const sourceTokens = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (char === "\n" || char === "\t" || char === " ") {
      // whitespaces
      index++;
      continue;
    } else if (char === "/" && nextChar === "/") {
      const skipTill = findIndexAfter({
        after: index,
        string: source,
        toFind: "\n"
      });
      index += skipTill;
      continue;
    } else if (char === "/" && nextChar === "*") {
      // block level comment
      const skipTill = findIndexAfter({
        after: index,
        string: source,
        toFind: "*/"
      });
      index += skipTill;
      continue;
    } else if (Object.keys(doubleCharSymbol).find(s => s === char + nextChar)) {
      // 2 char symbols before 1 char
      const symbol = char + nextChar;
      sourceTokens.push(doubleCharSymbol[symbol]);
      // cause they are 2 char symbol
      index += 2;
    } else if (Object.keys(singleCharSymbols).find(s => s === char)) {
      // single char symbols
      sourceTokens.push(singleCharSymbols[char]);
      index += 1;
    } else if (char.match(/[a-z|A-Z]/)) {
      // keywords
    } else if (char.match(/\d/)) {
      // number
    } else {
      // syntax error
      throw new Error(`Invalid token, index: ${index} found: ${char}`);
    }
  }

  return sourceTokens;
}

function findIndexAfter({ string = "", after = 0, toFind = "" }) {
  return string.substring(after).indexOf(toFind);
}

console.log(scanToken("+-*/\t\n /** jkasdjhkajsd */"));
