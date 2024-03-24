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

export type IfStmt = {
  type: "IfStmt";
  condition: Expr;
  thenBranch: Stmt;
  elseBranch: Stmt | null;
};

export type WhileStmt = {
  type: "WhileStmt";
  condition: Expr;
  body: Stmt;
};

export type FunctionStmt = {
  type: "FunctionStmt";
  name: Token;
  params: Token[];
  body: Stmt[];
};

export type ReturnStmt = {
  type: "ReturnStmt";
  keyword: Token;
  value: Expr | null;
};

export type Stmt =
  | ExprStmt
  | PrintStmt
  | VarStmt
  | BlockStmt
  | IfStmt
  | WhileStmt
  | FunctionStmt
  | ReturnStmt;

export function createReturnStmt(
  keyword: Token,
  value: Expr | null
): ReturnStmt {
  return {
    type: "ReturnStmt",
    keyword,
    value,
  };
}

export function createFunctionStmt(
  name: Token,
  params: Token[],
  body: Stmt[]
): FunctionStmt {
  return {
    type: "FunctionStmt",
    name,
    params,
    body,
  };
}

export function createWhileStmt(condition: Expr, body: Stmt): WhileStmt {
  return {
    type: "WhileStmt",
    condition,
    body,
  };
}

export function createIfStmt(
  condition: Expr,
  thenBranch: Stmt,
  elseBranch: Stmt | null
): IfStmt {
  return {
    type: "IfStmt",
    condition,
    thenBranch,
    elseBranch,
  };
}

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
