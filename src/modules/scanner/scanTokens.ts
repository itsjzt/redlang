import { scanToken } from "./scanToken";
import { Token, createToken } from "./token";

export function scanTokens(source: string): Token[] {
  let tokens: Token[] = [];
  let currentIndex = 0;
  let currentLine = 1;

  while (currentIndex < source.length) {
    const currentChar = source[currentIndex];
    const slicedSource = source.slice(currentIndex);

    const { charsConsumed, newlinesConsumed } = scanToken({
      currentChar,
      currentLine,
      source: slicedSource,
      tokens,
    });

    currentIndex += charsConsumed;
    currentLine += newlinesConsumed;
  }

  tokens.push(createToken("EOF", null, null, currentLine));

  return tokens;
}
