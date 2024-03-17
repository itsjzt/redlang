import { Token } from "./modules/scanner/token";

export let hadError = false;

export function throwScanningError(line: number, errorMessage: string) {
  reportError(line, "", errorMessage);
  hadError = true;
}

export function throwParsingError(token: Token, errorMessage: string) {
  if (token.type == "EOF") {
    reportError(token.line, " at end", errorMessage);
  } else {
    reportError(token.line, " at '" + token.lexeme + "'", errorMessage);
  }
}

function formatError(line: number, where: string, errorMessage: string) {
  return `[line ${line}] Error ${where}: ${errorMessage}`;
}

function reportError(line: number, where: string, errorMessage: string) {
  console.log(formatError(line, where, errorMessage));
}
