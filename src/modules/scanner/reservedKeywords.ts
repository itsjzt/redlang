import { TokenType } from "./tokenTypes";

export type Keyword =
  | "and"
  | "class"
  | "else"
  | "false"
  | "for"
  | "fun"
  | "if"
  | "nil"
  | "or"
  | "print"
  | "return"
  | "super"
  | "this"
  | "true"
  | "var"
  | "while";

export const reservedKeywords: Record<Keyword, TokenType> = {
  and: "AND",
  class: "CLASS",
  else: "ELSE",
  false: "FALSE",
  for: "FOR",
  fun: "FUN",
  if: "IF",
  nil: "NIL",
  or: "OR",
  print: "PRINT",
  return: "RETURN",
  super: "SUPER",
  this: "THIS",
  true: "TRUE",
  var: "VAR",
  while: "WHILE",
};
