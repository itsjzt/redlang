import { Token } from "../scanner/token";
import { ExprStmt, PrintStmt } from "./stmt";

export type BinaryExpr = {
  type: "Binary";
  left: Expr;
  right: Expr;
  operator: Token;
};

export type GroupingExpr = {
  type: "Group";
  expr: Expr;
};

export type LiteralExpr = {
  type: "Literal";
  value: any;
};

export type UnaryExpr = {
  type: "Unary";
  right: Expr;
  operator: Token;
};

export type VariableExpr = {
  type: "Variable";
  name: Token;
};

export type AssignExpr = {
  type: "Assign";
  name: Token;
  value: Expr;
};

export type Expr =
  | BinaryExpr
  | UnaryExpr
  | LiteralExpr
  | GroupingExpr
  | VariableExpr
  | AssignExpr;

export function createAssignExpr(name: Token, value: Expr): AssignExpr {
  return {
    name: name,
    type: "Assign",
    value,
  };
}

export function createVariableExpr(name: Token): VariableExpr {
  return {
    name: name,
    type: "Variable",
  };
}

export function createBinaryExpr(
  operator: Token,
  left: Expr,
  right: Expr
): BinaryExpr {
  return {
    type: "Binary",
    left,
    right,
    operator,
  };
}

export function createUnaryExpr(operator: Token, right: Expr): UnaryExpr {
  return {
    type: "Unary",
    right,
    operator,
  };
}

export function createLiteralExpr(value: any): LiteralExpr {
  return {
    type: "Literal",
    value,
  };
}

export function createGroupingExpr(expr: Expr): GroupingExpr {
  return {
    type: "Group",
    expr,
  };
}
