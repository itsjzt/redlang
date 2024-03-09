import { TokenType } from "./tokenTypes";

export interface Token {
  type: TokenType;
  lexeme: string | null;
  literal: any | null;
  line: number;
}

export function createToken(
  type: TokenType,
  lexeme: string | null,
  literal: any | null,
  line: number
): Token {
  return {
    type,
    lexeme,
    literal,
    line,
  };
}

export function printToken(token: Token) {
  console.log({
    type: token.type,
    lexeme: token.lexeme,
    literal: token.literal,
    line: token.line,
  });
}
