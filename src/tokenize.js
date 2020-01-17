const singleCharSymbolNames = {
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

const doubleCharSymbolNames = {
  "<=": "GREATER_THAN_EQUAL",
  ">=": "LESS_THAN_EQUAL",
  "==": "DOUBLE_EQUAL",
  "+=": "PLUS_EQUAL",
  "-=": "DASH_EQUAL",
  "*=": "STAR_EQUAL",
  "/=": "SLASH_EQUAL",
  "!=": "EXCLAMATION_EQUAL"
};

const singleCharSymbols = Object.keys(singleCharSymbolNames);
const doubleCharSymbols = Object.keys(doubleCharSymbolNames);
const whitespaces = [" ", "\t", "\n", "\r\n", "\r"];

function tokenize(source = "") {
  let tokens = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (whitespaces.includes(char)) {
      // whitespaces
      index += 1;
    } else if (char + nextChar === "//") {
      const skipTill = findIndexAfter({
        after: index,
        string: source,
        toFind: "\n"
      });
      index += skipTill;
    } else if (char + nextChar === "/*") {
      // block level comment
      const skipTill = findIndexAfter({
        after: index,
        string: source,
        toFind: "*/"
      });
      index += skipTill;
    } else if (doubleCharSymbols.includes(char + nextChar)) {
      // 2 char symbols before 1 char
      const symbol = char + nextChar;
      const tokenName = doubleCharSymbolNames[symbol];
      tokens.push(tokenName);
      index += symbol.length;
    } else if (singleCharSymbols.includes(char)) {
      // 1 char symbols
      const tokenName = singleCharSymbolNames[char];
      tokens.push(tokenName);
      index += char.length;
    } else if (char.match(/[a-z|A-Z]/)) {
      // keywords
      index++;
    } else if (char.match(/\d/)) {
      // number
      index++;
    } else {
      // syntax error
      throw new Error(`Error: Invalid token, index: ${index} found: ${char}`);
    }
  }

  return tokens;
}

function findIndexAfter({ string = "", after = 0, toFind = "" }) {
  const stringAfter = string.substring(after);
  const startIndex = stringAfter.indexOf(toFind);

  // handle toFind not present case
  if (startIndex < 0) {
    return stringAfter.length;
  }

  return startIndex + toFind.length;
}

module.exports = {
  tokenize,
  doubleCharSymbolNames,
  singleCharSymbolNames,
  singleCharSymbols,
  doubleCharSymbols,
  whitespaces
};
