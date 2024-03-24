import { throwParsingError } from "../../throwError";
import { Token } from "../scanner/token";
import { TokenType } from "../scanner/tokenTypes";
import {
  CallExpr,
  Expr,
  createAssignExpr,
  createBinaryExpr,
  createCallExpr,
  createGroupingExpr,
  createLiteralExpr,
  createLogicalExpr,
  createUnaryExpr,
  createVariableExpr,
} from "./expr";
import {
  ExprStmt,
  FunctionStmt,
  IfStmt,
  PrintStmt,
  Stmt,
  VarStmt,
  WhileStmt,
  createBlockStmt,
  createExprStatement,
  createFunctionStmt,
  createIfStmt,
  createPrintStatement,
  createVarStatement,
  createWhileStmt,
} from "./stmt";

interface IParserState {
  currentTokenIndex: number;
  tokens: Token[];
}

let parserState: IParserState;

export function parse(tokens: Token[]) {
  parserState = {
    currentTokenIndex: 0,
    tokens: tokens,
  };
  let statements: Stmt[] = [];

  while (!isAtEnd()) {
    let stmt = declaration();
    if (stmt) {
      statements.push(stmt);
    }
  }

  return statements;
}

function declaration(): Stmt | null {
  try {
    if (match("FUN")) {
      return functionDeclaration("function");
    }

    if (match("VAR")) {
      return varDeclaration();
    }

    return statement();
  } catch (e) {
    synchronize();
    return null;
  }
}

function functionDeclaration(kind: string): FunctionStmt {
  let name = consume("IDENTIFIER", `Expect ${kind} name.`);
  consume("LEFT_PAREN", `Expect '(' after ${kind} name`);

  let params: Token[] = [];

  if (!check("RIGHT_PAREN")) {
    do {
      if (params.length >= 255) {
        throwParsingError(peek(), "Can't have more than 255 parameters");
      }

      params.push(consume("IDENTIFIER", "Expect parameter name."));
    } while (match("COMMA"));
  }

  consume("RIGHT_PAREN", "Expect ')' after parameters");

  consume("LEFT_BRACE", `Expect '{' before ${kind} body.`);
  let body = block();

  return createFunctionStmt(name, params, body);
}

function varDeclaration(): VarStmt {
  let name = consume("IDENTIFIER", "Expect variable name");
  let initializer: Expr | null = null;

  if (match("EQUAL")) {
    initializer = expression();
  }

  consume("SEMICOLON", "Expect ';' after declaration.");

  return createVarStatement(name, initializer);
}

function statement(): Stmt {
  if (match("IF")) {
    return ifStatement();
  }

  // if (match("FOR")) {
  //   return forStatement();
  // }

  if (match("WHILE")) {
    return whileStatement();
  }

  if (match("PRINT")) {
    return printStatement();
  }

  if (match("LEFT_BRACE")) {
    return createBlockStmt(block());
  }

  return expressionStatement();
}

// function forStatement(): WhileStmt {
//   consume("LEFT_PAREN", "Expect '(' after for.");

//   let initializer;
//   if (match("SEMICOLON")) {
//     initializer = null;
//   } else if ("VAR") {
//     initializer = varDeclaration();
//   } else {
//     initializer = expressionStatement();
//   }

//   let condition: Expr = createLiteralExpr(true);

//   if (!check("SEMICOLON")) {
//     expression();
//   }

//   consume("SEMICOLON", "Expect ';' after loop condition.");

//   let increment = null;

//   if (!check("RIGHT_PAREN")) {
//     increment = expression();
//   }

//   consume("RIGHT_PAREN", "Expect ')' after for clauses.");

//   let body = statement();

//   if (increment !== null) {
//     body = createBlockStmt([body, createExprStatement(increment)]);
//   }

//   return createWhileStmt(condition, body);
//   // BOOKMARK: 9.5.1
// }

function whileStatement(): WhileStmt {
  consume("LEFT_PAREN", "Expect '(' after while.");
  let condition = expression();
  consume("RIGHT_PAREN", "Expect ')' after while.");
  let body: Stmt = statement();

  return createWhileStmt(condition, body);
}

function ifStatement(): IfStmt {
  consume("LEFT_PAREN", "Expect ')' after 'if'.");

  let condition = expression();

  consume("RIGHT_PAREN", "Expect ')' after if condition.");

  let thenBranch = statement();
  let elseBranch: Stmt | null = null;

  if (match("ELSE")) {
    elseBranch = statement();
  }

  return createIfStmt(condition, thenBranch, elseBranch);
}

function block(): Stmt[] {
  let statements: Stmt[] = [];

  while (!check("RIGHT_BRACE") && !isAtEnd()) {
    statements.push(declaration()!);
  }

  consume("RIGHT_BRACE", "Expect '}' after block.");

  return statements;
}

function printStatement(): PrintStmt {
  let value = expression();
  consume("SEMICOLON", "Expect ';' after value");

  return createPrintStatement(value);
}

function expressionStatement(): ExprStmt {
  let expr = expression();
  consume("SEMICOLON", "Expect ';' after expression");
  return createExprStatement(expr);
}

function expression(): Expr {
  return assignment();
}

function assignment(): Expr {
  const expr = or();

  if (match("EQUAL")) {
    let equal = previous();
    let value = assignment();

    if (expr.type === "Variable") {
      let name = expr.name;
      return createAssignExpr(name, value);
    }

    throw throwParsingError(equal, "Invalid assignment target.");
  }

  return expr;
}

function or(): Expr {
  let left = and();

  while (match("OR")) {
    let operator = previous();
    let right = and();

    return createLogicalExpr(operator, left, right);
  }

  return left;
}

function and(): Expr {
  let left = equality();

  while (match("AND")) {
    let operator = previous();
    let right = equality();

    return createLogicalExpr(operator, left, right);
  }

  return left;
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

  return call();
}

function call(): Expr {
  let expr = primary();

  while (true) {
    if (match("LEFT_PAREN")) {
      expr = finishCall(expr);
    } else {
      break;
    }
  }

  return expr;
}

function finishCall(callee: Expr): CallExpr {
  let args = [];

  if (!check("RIGHT_PAREN")) {
    do {
      if (args.length >= 255) {
        throwParsingError(peek(), "Can't have more than 255 arguments.");
      }
      args.push(expression());
    } while (match("COMMA"));
  }

  let paren = consume("RIGHT_PAREN", "Expect ')' after arguments.");

  return createCallExpr(callee, paren, args);
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

  if (match("IDENTIFIER")) {
    return createVariableExpr(previous());
  }

  if (match("LEFT_PAREN")) {
    let expr = expression();
    consume("RIGHT_PAREN", "Expect ')' after expression.");
    return createGroupingExpr(expr);
  }

  throw throwParsingError(peek(), "Expected expression.");
}

function consume(type: TokenType, errorMessage: string): Token {
  if (check(type)) {
    return advance();
  }

  throw throwParsingError(peek(), errorMessage);
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

  while (!isAtEnd()) {
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
