import { Token, createToken } from "./token";
import { TokenType } from "./tokenTypes";

export class ScannerState {
  content: String;
  cursor: number;
  tokens: Token[];
  lineCount: number;

  constructor(content: String) {
    this.content = content;
    this.cursor = 0;
    this.tokens = [];
    this.lineCount = 0;
  }

  peek() {
    return this.content[this.cursor];
  }

  at(index: number) {
    return this.content[index];
  }

  consume() {
    const char = this.peek();
    this.cursor += 1;

    return char;
  }

  isAtEnd() {
    if (this.cursor < this.content.length) {
      return false;
    }

    return true;
  }

  increaseLineCount() {
    this.lineCount += 1;
  }

  pushToken(tokenType: TokenType, value: any) {
    this.tokens.push(createToken(tokenType, value, null, this.lineCount));
  }
}
