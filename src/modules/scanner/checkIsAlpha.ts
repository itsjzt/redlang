import { alphaChars } from "./alphaChars";

export function checkIsAlpha(currentChar: string) {
  if (alphaChars.includes(currentChar)) {
    return true;
  }

  return false;
}
