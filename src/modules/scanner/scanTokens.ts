import { error } from "../../error";
import { Token, createToken } from "./token";
import { TokenType } from "./tokenTypes";

export function scanTokens(source: string): Token[] {
  let tokens: Token[] = [];
  let currentIndex = 0;

  while (currentIndex < source.length) {
    const currentChar = source[currentIndex];
    const slicedSource = source.slice(currentIndex);
    let currentLine = 0;

    const { charsConsumed, newlinesConsumed } = scanToken({
      currentChar,
      currentLine,
      source: slicedSource,
      tokens,
    });

    currentIndex += charsConsumed;
    currentLine += newlinesConsumed;
  }

  return tokens;
}

interface ScanTokenOutput {
  charsConsumed: number;
  newlinesConsumed: number;
}

interface ScanTokenInput {
  currentChar: string;
  currentLine: number;
  source: string;
  tokens: Token[];
}

function scanToken({
  currentChar,
  currentLine,
  source,
  tokens,
}: ScanTokenInput): ScanTokenOutput {
  function addToken(tokenType: TokenType, chars = 1, value: any = null) {
    const text = source.slice(0, chars);
    return tokens.push(createToken(tokenType, text, value, currentLine));
  }

  function genReport(chars = 1, newlines = 0): ScanTokenOutput {
    return { charsConsumed: chars, newlinesConsumed: newlines };
  }

  switch (currentChar) {
    case "(":
      addToken("LEFT_PAREN");
      return genReport();
    case ")":
      addToken("RIGHT_PAREN");
      return genReport();
    case "{":
      addToken("LEFT_BRACE");
      return genReport();
    case "}":
      addToken("RIGHT_BRACE");
      return genReport();
    case ",":
      addToken("COMMA");
      return genReport();
    case ".":
      addToken("DOT");
      return genReport();
    case "-":
      addToken("MINUS");
      return genReport();
    case "+":
      addToken("PLUS");
      return genReport();
    case ";":
      addToken("SEMICOLON");
      return genReport();
    case "*":
      addToken("STAR");
      return genReport();
    case "\r":
    case " ":
    case "\t":
      return genReport();
    case "\n":
      return genReport(1, 1);
    case '"': {
      const stringReport = consumeString(source, currentLine);

      if (stringReport) {
        const { charsConsumed, newlinesConsumed } = stringReport;

        addToken(
          "STRING",
          // get the ending quote as well in lexeme
          charsConsumed,
          source.slice(
            1,
            charsConsumed - 1 /** this will leave the surrounding quotes */
          )
        );

        return genReport(charsConsumed, newlinesConsumed);
      }

      // this means an error occurred
      return genReport();
    }
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9": {
      const charsConsumed = consumeDigit(source);
      addToken(
        "NUMBER",
        charsConsumed,
        parseFloat(source.slice(0, charsConsumed))
      );
      return genReport(charsConsumed);
    }
    case "!": {
      const isDoubleCharToken = matchNextChar("=", source);
      addToken(isDoubleCharToken ? "BANG_EQUAL" : "BANG");
      return genReport(isDoubleCharToken ? 2 : 1);
    }
    case "=": {
      const isDoubleCharToken = matchNextChar("=", source);
      addToken(isDoubleCharToken ? "EQUAL_EQUAL" : "EQUAL");
      return genReport(isDoubleCharToken ? 2 : 1);
    }
    case "<": {
      const isDoubleCharToken = matchNextChar("=", source);
      addToken(isDoubleCharToken ? "LESS_EQUAL" : "LESS");
      return genReport(isDoubleCharToken ? 2 : 1);
    }
    case ">": {
      const isDoubleCharToken = matchNextChar("=", source);
      addToken(isDoubleCharToken ? "GREATER_EQUAL" : "GREATER");
      return genReport(isDoubleCharToken ? 2 : 1);
    }
    case "/": {
      if (matchNextChar("/", source)) {
        const offset = consumeCharacterTill("\n", source);

        return genReport(offset);
      }

      addToken("SLASH");
      return genReport();
    }
    default: {
      if (checkIsAlpha(currentChar)) {
        const offset = consumeIdentifier(source);
        const lexeme = source.slice(0, offset);

        if (reservedKeywords[lexeme]) {
          addToken(reservedKeywords[lexeme], offset);
        } else {
          addToken("IDENTIFIER", offset);
        }

        return genReport(offset);
      }
      error(currentLine, "Unexpected Character");
      return genReport();
    }
  }
}

function consumeIdentifier(source: string): number {
  let i = 1; /** the first character is already checked to be an alpha; start from the second char */

  for (; i < source.length; i++) {
    const currentChar = source[i];
    if (checkIsAlphaNumeric(currentChar)) {
      continue;
    }

    return i;
  }

  return i;
}

const alphaChars = [
  "-",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const numberChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const reservedKeywords: Record<string, TokenType> = {
  and: "AND",
  class: "CLASS",
  else: "ELSE",
  false: "FALSE",
  for: "FOR",
  fun: "FUN",
  if: "IF",
  nil: "NIL",
  or: "OR",
  print: "PRINT",
  return: "RETURN",
  super: "SUPER",
  this: "THIS",
  true: "TRUE",
  var: "VAR",
  while: "WHILE",
};

function checkIsAlpha(currentChar: string) {
  if (alphaChars.includes(currentChar)) {
    return true;
  }

  return false;
}

function checkIsAlphaNumeric(currentChar: string) {
  if (alphaChars.includes(currentChar)) {
    return true;
  }

  if (numberChars.includes(currentChar)) {
    return true;
  }

  return false;
}

function consumeDigit(source: string): number {
  let i = 0;
  for (; i < source.length; i++) {
    const currentChar = source[i];

    if (numberChars.includes(currentChar)) {
      continue;
    }

    const nextChar = getCharAtIndex(source, i + 1);
    if (currentChar === "." && nextChar && numberChars.includes(nextChar)) {
      continue;
    }

    return i;
  }

  return i;
}

function getCharAtIndex(source: string, index: number) {
  if (source.length > index + 1) {
    return source[1];
  }

  return null;
}

function matchNextChar(expectedChar: string, source: string) {
  const nextChar = getCharAtIndex(source, 1);
  if (nextChar) {
    return nextChar === expectedChar;
  }

  return false;
}

function consumeString(
  source: string,
  currentLine: number
): ScanTokenOutput | null {
  const expectedChar = '"';
  let newlinesConsumed = 0;

  for (
    let i = 1 /* start counting after the starting quote */;
    i < source.length;
    i++
  ) {
    const currentChar = source[i];
    console.log({ currentChar, i });

    if (currentChar === "\n") {
      newlinesConsumed += 1;
    }

    if (currentChar === expectedChar) {
      return { charsConsumed: i + 1 /* end quote */, newlinesConsumed };
    }
  }

  error(currentLine, "Unterminated string");
  return null;
}

function consumeCharacterTill(expectedChar: string, source: string): number {
  let i = 0;
  for (; i < source.length; i++) {
    const currentChar = source[i];
    if (currentChar === expectedChar) {
      return i;
    }
  }

  // return the last token if not found
  // because in our use case we consumed everything
  // in search of this character
  return i;
}

// const singleCharSymbolNames = {
//   "*": "STAR",
//   "+": "PLUS",
//   "-": "DASH",
//   "/": "SLASH",
//   "%": "PERCENT",
//   "<": "ANGLE_LEFT",
//   ">": "ANGLE_RIGHT",
//   "!": "EXCLAMATION",
//   "=": "EQUALS",
//   ",": "COMMA",
//   ";": "SEMICOLON",
//   ".": "DOT",
//   ":": "COLON",
//   ")": "PARENTHESIS_CLOSE",
//   "(": "PARENTTHESIS_OPEN",
//   "[": "BRACKET_OPEN",
//   "]": "BRACKET_CLOSE",
//   "{": "BRACES_OPEN",
//   "}": "BRACES_CLOSE"
// };

// const doubleCharSymbolNames = {
//   "<=": "GREATER_THAN_EQUAL",
//   ">=": "LESS_THAN_EQUAL",
//   "==": "DOUBLE_EQUAL",
//   "+=": "PLUS_EQUAL",
//   "-=": "DASH_EQUAL",
//   "*=": "STAR_EQUAL",
//   "/=": "SLASH_EQUAL",
//   "!=": "EXCLAMATION_EQUAL"
// };

// const numberLiterals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

// const keywords = [
//   "for",
//   // else if should be above else/if
//   "else if",
//   "if",
//   "else",
//   "while",
//   "import",
//   "from",
//   "function",
//   "return",
//   "var",
//   "true",
//   "false",
//   "null"
// ];

// const singleCharSymbols = Object.keys(singleCharSymbolNames);
// const doubleCharSymbols = Object.keys(doubleCharSymbolNames);
// const whitespaces = [" ", "\t", "\n", "\r\n", "\r"];

// function findIndexAfter({ string = "", after = 0, toFind = "" }) {
//   const stringAfter = string.substring(after);
//   const startIndex = stringAfter.indexOf(toFind);

//   // handle toFind not present case
//   if (startIndex < 0) {
//     return stringAfter.length;
//   }

//   return startIndex + toFind.length;
// }

// if (whitespaces.includes(char)) {
//   // white spaces
//   index += 1;
// } else if (char + nextChar === "//") {
//   const skipTill = findIndexAfter({
//     after: index,
//     string: source,
//     toFind: "\n",
//   });
//   index += skipTill;
// } else if (char + nextChar === "/*") {
//   // block level comment
//   const skipTill = findIndexAfter({
//     after: index,
//     string: source,
//     toFind: "*/",
//   });
//   index += skipTill;
// } else if (char === '"') {
//   // because we want next occurance
//   const nextIndex = index + 1;
//   const skipTill = findIndexAfter({
//     string: source,
//     after: nextIndex,
//     toFind: '"',
//   });
//   tokens.push("STRING");
//   index = nextIndex + skipTill;
// } else if (doubleCharSymbols.includes(char + nextChar)) {
//   // 2 char symbols before 1 char
//   const symbol = char + nextChar;
//   const tokenName = doubleCharSymbolNames[symbol];
//   tokens.push(tokenName);
//   index += symbol.length;
// } else if (singleCharSymbols.includes(char)) {
//   // 1 char symbols
//   const tokenName = singleCharSymbolNames[char];
//   tokens.push(tokenName);
//   index += char.length;
// } else if (char.match(/[a-z|A-Z]/)) {
//   // keywords
//   const afterString = source.substring(index);
//   const currentKeyword = keywords.find((k) => afterString.startsWith(k));
//   if (currentKeyword) {
//     tokens.push(currentKeyword.toUpperCase().replace(" ", "_"));
//     index += currentKeyword.length;
//   } else {
//     throw new Error(
//       `Error: Invalid keyword index: ${index} found: ${afterString.split}`
//     );
//   }
// } else if (char.match(/[0-9]/)) {
//   // cause 1 char is already number.that why it matched
//   let skipTill = 1;
//   while (numberLiterals.includes(source[index + skipTill])) {
//     skipTill++;
//   }
//   tokens.push("NUMBER");
//   // number
//   index += skipTill;
// } else {
//   // syntax error
//   throw new Error(`Error: Invalid token, index: ${index} found: ${char}`);
// }
