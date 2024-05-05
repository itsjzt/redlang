import { throwParsingError } from "../../throwError";
import { AssignExpr, Expr, VariableExpr } from "../parser/expr";
import { BlockStmt, Stmt, VarStmt } from "../parser/stmt";
import { Token } from "../scanner/token";

let scopes: Array<Map<string, any>> = [];

export function resolver(statements: Stmt[]) {
  return visitStatements(statements);
}

function visitStatements(stmts: Stmt[]) {
  for (let statement of stmts) {
    visitStatement(statement);
  }
}

function visitStatement(stmt: Stmt) {
  switch (stmt.type) {
    case "BlockStmt":
      visitBlockStatement(stmt);
      break;
    case "VarStmt":
      visitVariableDeclaration(stmt);
  }
}

function visitExpression(expr: Expr) {}

function visitVariableDeclaration(stmt: VarStmt) {
  declare(stmt.name);
  if (stmt.initializer !== null) {
    visitExpression(stmt.initializer);
  }

  define(stmt.name);
  return null;
}

function declare(name: Token) {
  if (scopes.length === 0) {
    return;
  }

  let scope = scopes.at(-1);
  if (scope) {
    scope.set(name.lexeme!, false);
  }
}

function define(name: Token) {
  if (scopes.length === 0) {
    return;
  }

  let scope = scopes.at(-1);
  if (scope) {
    scope.set(name.lexeme!, true);
  }
}

function visitVariableExpr(expr: VariableExpr) {
  if (scopes.length !== 0 && scopes.at(-1)!.get(expr.name.lexeme!) === false) {
    throw throwParsingError(
      expr.name,
      "Can't read local variable in its own initializer"
    );
  }

  resolveLocal(expr, expr.name);
  return null;
}

function resolveLocal(expr: VariableExpr, name: Token) {
  for (let i = scopes.length - 1; i >= 0; i--) {
    if (scopes[i].has(name.lexeme!)) {
      // resolve
      // save the variable resolution
      return;
    }
  }
}

function visitAssignExpr(expr: AssignExpr) {
  visitExpression(expr.value);
  resolveLocal(expr, expr.name);
  return;
}

function visitBlockStatement(stmt: BlockStmt) {
  beginScope();
  visitStatements(stmt.statements);
  endScope();

  return null;
}

function beginScope() {
  scopes.push(new Map<string, any>());
}

function endScope() {
  scopes.pop();
}
