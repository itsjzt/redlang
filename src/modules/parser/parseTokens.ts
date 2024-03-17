import { throwParsingError } from "../../throwError";
import { Token } from "../scanner/token";
import { TokenType } from "../scanner/tokenTypes";
import {
  Expr,
  createBinaryExpr,
  createGroupingExpr,
  createLiteralExpr,
  createUnaryExpr,
} from "./expr";

interface IParserState {
  currentTokenIndex: number;
  tokens: Token[];
}

let parserState: IParserState;

export function parseTokens(tokens: Token[]) {
  parserState = {
    currentTokenIndex: 0,
    tokens: tokens,
  };

  try {
    return expression();
  } catch (e) {
    return null;
  }
}

function expression(): Expr {
  return equality();
}

function equality(): Expr {
  let expr = comparison();

  while (match("BANG_EQUAL", "EQUAL_EQUAL")) {
    let operator = previous();
    let right = comparison();

    expr = createBinaryExpr(operator, expr, right);
  }

  return expr;
}

function comparison(): Expr {
  let expr = term();

  while (match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
    let operator = previous();
    let right = term();
    expr = createBinaryExpr(operator, expr, right);
  }

  return expr;
}

function term(): Expr {
  let expr = factor();

  while (match("MINUS", "PLUS")) {
    let operator = previous();
    let right = factor();
    expr = createBinaryExpr(operator, expr, right);
  }

  return expr;
}

function factor(): Expr {
  let expr = unary();

  while (match("STAR", "SLASH")) {
    let operator = previous();
    let right = unary();
    expr = createBinaryExpr(operator, expr, right);
  }

  return expr;
}

function unary(): Expr {
  while (match("BANG", "MINUS")) {
    let operator = previous();
    let right = primary();
    return createUnaryExpr(operator, right);
  }

  return primary();
}

function primary(): Expr {
  if (match("NIL")) {
    return createLiteralExpr(null);
  }
  if (match("FALSE")) {
    return createLiteralExpr(false);
  }
  if (match("TRUE")) {
    return createLiteralExpr(true);
  }

  if (match("NUMBER", "STRING")) {
    return createLiteralExpr(previous().literal);
  }

  if (match("LEFT_PAREN")) {
    let expr = expression();
    consume("RIGHT_PAREN", "Expect ')' after expression.");
    return createGroupingExpr(expr);
  }

  throw throwParsingError(peek(), "Expected expression.");
}

function consume(type: TokenType, errorMessage: string) {
  if (check(type)) {
    return advance();
  }

  return throwParsingError(peek(), errorMessage);
}

function match(...types: TokenType[]) {
  for (let type of types) {
    if (check(type)) {
      advance();
      return true;
    }
  }

  return false;
}

function check(type: TokenType) {
  if (isAtEnd()) {
    return false;
  }

  return peek().type === type;
}

function advance() {
  if (!isAtEnd()) {
    parserState.currentTokenIndex++;
  }

  return previous();
}

function isAtEnd() {
  return peek().type === "EOF";
}

function peek(): Token {
  return parserState.tokens[parserState.currentTokenIndex];
}

function previous(): Token {
  return parserState.tokens[parserState.currentTokenIndex - 1];
}

function synchronize() {
  advance();

  while (isAtEnd()) {
    if (previous().type == "SEMICOLON") return;

    switch (peek().type) {
      case "CLASS":
      case "FUN":
      case "VAR":
      case "IF":
      case "WHILE":
      case "PRINT":
      case "RETURN":
        return;
    }

    advance();
  }
}
