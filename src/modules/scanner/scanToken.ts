import { throwScanningError } from "../../throwError";
import { checkIsAlpha } from "./checkIsAlpha";
import { consumeComment } from "./consumeComment";
import { consumeDigit } from "./consumeDigit";
import { consumeIdentifier } from "./consumeIdentifier";
import { consumeString } from "./consumeString";
import { reservedKeywords } from "./reservedKeywords";
import { createToken } from "./token";
import { TokenType } from "./tokenTypes";
import { ScanTokenInput, ScanTokenOutput } from "./scannerInterface";

export function scanToken({
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
    case "%": {
      addToken("MODULUS");
      return genReport();
    }
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
        const offset = consumeComment(source);

        return genReport(offset);
      }

      addToken("SLASH");
      return genReport();
    }
    default: {
      if (checkIsAlpha(currentChar)) {
        const offset = consumeIdentifier(source);
        const lexeme = source.slice(0, offset);

        if (lexeme in reservedKeywords) {
          // @ts-ignore
          addToken(reservedKeywords[lexeme], offset);
        } else {
          addToken("IDENTIFIER", offset);
        }

        return genReport(offset);
      }
      throwScanningError(currentLine, "Unexpected Character");
      return genReport();
    }
  }
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
