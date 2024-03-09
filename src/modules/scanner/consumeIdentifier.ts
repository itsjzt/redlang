import { alphaChars } from "./alphaChars";
import { numberChars } from "./numberChars";

export function consumeIdentifier(source: string): number {
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

function checkIsAlphaNumeric(currentChar: string) {
  if (alphaChars.includes(currentChar)) {
    return true;
  }

  if (numberChars.includes(currentChar)) {
    return true;
  }

  return false;
}
