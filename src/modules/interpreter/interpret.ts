import { throwRuntimeError } from "../../throwError";
import {
  BinaryExpr,
  Expr,
  LogicalExpr,
  UnaryExpr,
  VariableExpr,
} from "../parser/expr";
import { Stmt, VarStmt } from "../parser/stmt";
import { Token } from "../scanner/token";
import { VariableStore } from "./VariableStore";

let variableStore = new VariableStore(null);

export function interpret(statements: Stmt[]) {
  for (let stmt of statements) {
    evaluateStmt(stmt);
  }
}

function evaluateStmt(stmt: Stmt): null {
  switch (stmt.type) {
    case "ExprStmt":
      evaluateExpr(stmt.expression);
      break;
    case "PrintStmt":
      evaluatePrint(stmt.expression);
      break;
    case "VarStmt":
      evaluateDeclaration(stmt);
      break;
    case "BlockStmt":
      evaluateBlock(stmt.statements, new VariableStore(variableStore));
      break;
    case "IfStmt":
      evaluateIf(stmt.condition, stmt.thenBranch, stmt.elseBranch);
      break;
    case "WhileStmt":
      evaluateWhile(stmt.condition, stmt.body);
      break;
  }

  return null;
}

function evaluateWhile(condition: Expr, body: Stmt) {
  while (isTruthy(evaluateExpr(condition))) {
    evaluateStmt(body);
  }
}

function evaluateIf(
  condition: Expr,
  thenBranch: Stmt,
  elseBranch: Stmt | null
) {
  if (isTruthy(evaluateExpr(condition))) {
    evaluateStmt(thenBranch);
  } else if (elseBranch !== null) {
    evaluateStmt(elseBranch);
  }

  return null;
}

function evaluateBlock(stmts: Stmt[], environment: VariableStore) {
  let previousEnvironment = variableStore;
  try {
    variableStore = environment;
    for (let stmt of stmts) {
      evaluateStmt(stmt);
    }
  } finally {
    variableStore = previousEnvironment;
  }
}

function evaluateDeclaration(stmt: VarStmt): null {
  let value = null;

  if (stmt.initializer) {
    value = evaluateExpr(stmt.initializer);
  }

  variableStore.define(stmt.name.lexeme!, value);

  return null;
}

function evaluateVariableExpression(expr: VariableExpr) {
  return variableStore.get(expr.name);
}

function evaluatePrint(expr: Expr): null {
  const value = evaluateExpr(expr);

  console.log(value);
  return null;
}

function evaluateExpr(expr: Expr) {
  switch (expr.type) {
    case "Literal": {
      return expr.value;
    }
    case "Unary": {
      return evaluateUnaryOperator(expr);
    }
    case "Group": {
      return evaluateExpr(expr.expr);
    }
    case "Binary": {
      return evaluateBinaryOperator(expr);
    }
    case "Variable": {
      return evaluateVariableExpression(expr);
    }
    case "Assign": {
      return evaluateAssignExpression(expr.name, expr.value);
    }
    case "Logical":
      return evaluateLogicalExpression(expr);
    default:
      return null;
  }
}

function evaluateLogicalExpression(expr: LogicalExpr): any {
  let left = evaluateExpr(expr.left);

  if (expr.operator.type === "OR") {
    if (isTruthy(left)) {
      return left;
    }
  } else {
    if (!isTruthy(left)) {
      return left;
    }
  }

  return evaluateExpr(expr.right);
}

function evaluateAssignExpression(name: Token, value: Expr): any {
  if (variableStore.contains(name)) {
    return variableStore.assign(name, evaluateExpr(value));
  }

  throw throwRuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
}

function evaluateUnaryOperator(expr: UnaryExpr): null | boolean | any {
  const right = evaluateExpr(expr.right);

  if (expr.operator.type === "MINUS") {
    checkOperandIsNumber(expr.operator, expr.right);
    return -right;
  }

  if (expr.operator.type === "BANG") {
    return isTruthy(right);
  }

  // unreachable
  return null;
}

function checkOperandIsNumber(operator: Token, operand: any) {
  if (typeof operand !== "number") {
    throw throwRuntimeError(operator, "Operand must be a number");
  }
}

function checkOperandsAreNumber(operator: Token, left: any, right: any) {
  checkOperandIsNumber(operator, left);
  checkOperandIsNumber(operator, right);
}

function evaluateBinaryOperator(expr: BinaryExpr): null | any {
  const left: any = evaluateExpr(expr.left);
  const right: any = evaluateExpr(expr.right);

  switch (expr.operator.type) {
    case "MINUS":
      checkOperandsAreNumber(expr.operator, left, right);
      return left - right;
    case "STAR":
      checkOperandsAreNumber(expr.operator, left, right);
      return left * right;
    case "SLASH":
      checkOperandsAreNumber(expr.operator, left, right);
      return left / right;
    case "PLUS":
      if (typeof left === "number" || typeof right === "number") {
        return left + right;
      }
      if (typeof left === "string" || typeof right === "string") {
        return left + right;
      }

      throw throwRuntimeError(
        expr.operator,
        "Operands must be two numbers or two strings."
      );
    case "GREATER":
      checkOperandsAreNumber(expr.operator, left, right);
      return left > right;
    case "GREATER_EQUAL":
      checkOperandsAreNumber(expr.operator, left, right);
      return left >= right;
    case "LESS":
      checkOperandsAreNumber(expr.operator, left, right);
      return left < right;
    case "LESS_EQUAL":
      checkOperandsAreNumber(expr.operator, left, right);
      return left <= right;
    case "BANG_EQUAL":
      return !isEqual(left, right);
    case "EQUAL_EQUAL":
      return isEqual(left, right);
    default:
      return null;
  }
}

function isEqual(left: any, right: any): boolean {
  if (left === null && right === null) {
    return true;
  }

  if (left === null) {
    return false;
  }

  if (right === null) {
    return false;
  }

  if (typeof left === "string" && typeof right === "string") {
    return left === right;
  }

  if (typeof left === "number" && typeof right === "number") {
    return left === right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return left === right;
  }

  if (typeof left === "object" && typeof right === "object") {
    return left === right;
  }

  if (typeof left !== typeof right) {
    return false;
  }

  return false;
}

function isTruthy(value: any): boolean {
  if (value === null) {
    return false;
  }
  if (value === false) {
    return false;
  }

  if (value === 0) {
    return false;
  }

  // everything else is true
  return true;
}
