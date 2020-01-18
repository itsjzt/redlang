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

const numberLiterals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

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
    } else if (char === '"') {
      // because we want next occurance
      const nextIndex = index + 1;
      const skipTill = findIndexAfter({
        string: source,
        after: nextIndex,
        toFind: '"'
      });
      tokens.push("STRING");
      index = nextIndex + skipTill;
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
    } else if (char.match(/[0-9]/)) {
      // cause 1 char is already number.that why it matched
      let skipTill = 1;
      while (numberLiterals.includes(source[index + skipTill])) {
        skipTill++;
      }
      tokens.push("NUMBER");
      // number
      index += skipTill;
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
