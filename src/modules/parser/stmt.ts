import { Token } from "../scanner/token";
import { Expr } from "./expr";

// export type PrintStmt = {
//   expression: Expr;
//   type: "PrintStmt";
// };

export type ExprStmt = {
  expression: Expr;
  type: "ExprStmt";
};

export type VarStmt = {
  type: "VarStmt";
  initializer: Expr | null;
  name: Token;
  staticType: "INTEGER" | "FLOAT" | "STRING" | "BOOLEAN" | "CUSTOM";
  customTypeName?: string;
};

export type BlockStmt = {
  type: "BlockStmt";
  statements: Stmt[];
};

export type BreakStmt = {
  type: "BreakStmt";
  // TODO: add label
};

export type ContinueStmt = {
  type: "ContinueStmt";
  // TODO: add label
};

export type ElseIf = {
  condition: Expr;
  thenBranch: BlockStmt;
};

export type IfStmt = {
  type: "IfStmt";
  condition: Expr;
  thenBranch: BlockStmt;
  elseIfs: ElseIf[];
  elseBranch: BlockStmt | null;
};

export type WhileStmt = {
  type: "WhileStmt";
  condition: Expr;
  body: BlockStmt;
};

export type FunctionStmt = {
  type: "FunctionStmt";
  name: Token;
  params: Param[];
  body: Stmt[];
};

export type ReturnStmt = {
  type: "ReturnStmt";
  keyword: Token;
  value: Expr | null;
};

export type Stmt =
  | ExprStmt
  | VarStmt
  | BlockStmt
  | IfStmt
  | WhileStmt
  | FunctionStmt
  | ReturnStmt
  | BreakStmt
  | ContinueStmt;

export function createBreakStmt(): BreakStmt {
  return {
    type: "BreakStmt",
  };
}

export function createContinueStmt(): ContinueStmt {
  return {
    type: "ContinueStmt",
  };
}

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

export interface Param {
  token: Token;
  staticType: VarStmt["staticType"];
  customStaticType?: string;
}

export function createFunctionStmt(
  name: Token,
  params: Param[],
  body: Stmt[]
): FunctionStmt {
  return {
    type: "FunctionStmt",
    name,
    params,
    body,
  };
}

export function createWhileStmt(condition: Expr, body: BlockStmt): WhileStmt {
  return {
    type: "WhileStmt",
    condition,
    body,
  };
}

export function createIfStmt(
  condition: Expr,
  thenBranch: BlockStmt,
  elseIfs: ElseIf[] | null,
  elseBranch: BlockStmt | null
): IfStmt {
  return {
    type: "IfStmt",
    condition,
    elseIfs: elseIfs || [],
    thenBranch,
    elseBranch,
  };
}

export function createElseIf(condition: Expr, thenBranch: BlockStmt): ElseIf {
  return {
    condition,
    thenBranch,
  };
}

export function createBlockStmt(statements: Stmt[]): BlockStmt {
  return {
    statements: statements,
    type: "BlockStmt",
  };
}

export function createVarStatement(
  name: Token,
  expr: Expr | null,
  staticType: VarStmt["staticType"]
): VarStmt {
  return {
    initializer: expr ?? null,
    name: name,
    staticType,
    customTypeName: "",
    type: "VarStmt",
  };
}

export function createExprStatement(expr: Expr): ExprStmt {
  return {
    expression: expr,
    type: "ExprStmt",
  };
}

// export function createPrintStatement(expr: Expr): PrintStmt {
//   return {
//     expression: expr,
//     type: "PrintStmt",
//   };
// }
