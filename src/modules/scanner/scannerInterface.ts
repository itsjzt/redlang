import { Token } from "./token";

export interface ScanTokenOutput {
  charsConsumed: number;
  newlinesConsumed: number;
}

export interface ScanTokenInput {
  currentChar: string;
  currentLine: number;
  source: string;
  tokens: Token[];
}
