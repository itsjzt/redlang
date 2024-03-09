import { numberChars } from "./numberChars";

export function consumeDigit(source: string): number {
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
