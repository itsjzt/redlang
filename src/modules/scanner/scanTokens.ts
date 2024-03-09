import { scanToken } from "./scanToken";
import { Token } from "./token";

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
