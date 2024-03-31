import { TokenType } from "./tokenTypes";

// export type Keyword =
//   | "&&"
//   | "class"
//   | "else"
//   | "false"
//   | "for"
//   | "function"
//   | "if"
//   | "nil"
//   | "||"
//   | "print"
//   | "return"
//   | "super"
//   | "this"
//   | "true"
//   | "var"
//   | "while";

export const reservedKeywords: Map<string, TokenType> = new Map();

reservedKeywords.set("&&", "AND");
// reservedKeywords.set("class", "CLASS");
reservedKeywords.set("else", "ELSE");
reservedKeywords.set("false", "FALSE");
reservedKeywords.set("for", "FOR");
reservedKeywords.set("fn", "FUNCTION");
reservedKeywords.set("if", "IF");
reservedKeywords.set("nil", "NIL");
reservedKeywords.set("||", "OR");
// reservedKeywords.set("print", "PRINT");
reservedKeywords.set("return", "RETURN");
// reservedKeywords.set("super", "SUPER");
// reservedKeywords.set("this", "THIS");
reservedKeywords.set("true", "TRUE");
reservedKeywords.set("let", "VARIABLE");
reservedKeywords.set("while", "WHILE");
