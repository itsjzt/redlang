import { Token } from "../scanner/token";

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

export type LogicalExpr = {
  type: "Logical";
  left: Expr;
  right: Expr;
  operator: Token;
};

export type CallExpr = {
  type: "Call";
  callee: Expr;
  paren: Token;
  arguments: Expr[];
};

export type Expr =
  | BinaryExpr
  | UnaryExpr
  | LiteralExpr
  | GroupingExpr
  | VariableExpr
  | AssignExpr
  | LogicalExpr
  | CallExpr;

export function createLogicalExpr(
  operator: Token,
  left: Expr,
  right: Expr
): LogicalExpr {
  return {
    type: "Logical",
    left,
    right,
    operator,
  };
}

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

export function createCallExpr(
  callee: Expr,
  paren: Token,
  args: Expr[]
): CallExpr {
  return {
    type: "Call",
    callee,
    paren,
    arguments: args,
  };
}
