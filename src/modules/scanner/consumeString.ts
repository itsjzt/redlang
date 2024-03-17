import { throwScanningError } from "../../throwError";
import { ScanTokenOutput } from "./scannerInterface";

export function consumeString(
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

  throwScanningError(currentLine, "Unterminated string");
  return null;
}
