import { Token } from "../scanner/token";
import { Expr } from "./expr";

export type PrintStmt = {
  expression: Expr;
  type: "PrintStmt";
};

export type ExprStmt = {
  expression: Expr;
  type: "ExprStmt";
};

export type VarStmt = {
  type: "VarStmt";
  initializer: Expr | null;
  name: Token;
};

export type BlockStmt = {
  type: "BlockStmt";
  statements: Stmt[];
};

export type Stmt = ExprStmt | PrintStmt | VarStmt | BlockStmt;

export function createBlockStmt(statements: Stmt[]): BlockStmt {
  return {
    statements: statements,
    type: "BlockStmt",
  };
}

export function createVarStatement(name: Token, expr: Expr | null): VarStmt {
  return {
    initializer: expr ?? null,
    name: name,
    type: "VarStmt",
  };
}

export function createExprStatement(expr: Expr): ExprStmt {
  return {
    expression: expr,
    type: "ExprStmt",
  };
}

export function createPrintStatement(expr: Expr): PrintStmt {
  return {
    expression: expr,
    type: "PrintStmt",
  };
}
