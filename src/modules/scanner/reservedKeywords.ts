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

// reservedKeywords.set("class", "CLASS");
reservedKeywords.set("else", "ELSE");
reservedKeywords.set("false", "FALSE");
// reservedKeywords.set("for", "FOR");
reservedKeywords.set("break", "BREAK");
reservedKeywords.set("continue", "CONTINUE");
reservedKeywords.set("function", "FUNCTION");
reservedKeywords.set("if", "IF");
reservedKeywords.set("null", "NIL");
// reservedKeywords.set("print", "PRINT");
reservedKeywords.set("return", "RETURN");
// reservedKeywords.set("super", "SUPER");
// reservedKeywords.set("this", "THIS");
reservedKeywords.set("true", "TRUE");
reservedKeywords.set("var", "VARIABLE");
reservedKeywords.set("while", "WHILE");
// types
reservedKeywords.set("Int", "INTEGER");
reservedKeywords.set("Float", "FLOAT");
reservedKeywords.set("Bool", "BOOLEAN");
reservedKeywords.set("String", "STRING");
// reservedKeywords.set("Char", "WHILE");
