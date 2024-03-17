import { Expr } from "./expr";

export function prettifyAst(expr: Expr): string {
  switch (expr.type) {
    case "Binary":
      return parenthesize(
        expr.operator.lexeme!,
        prettifyAst(expr.left),
        prettifyAst(expr.right)
      );
    case "Group":
      return parenthesize("grouping", prettifyAst(expr.expr));
    case "Literal":
      if (expr.value) {
        return expr.value.toString();
      }
      return "nil";
    case "Unary":
      return parenthesize(expr.operator.lexeme!, prettifyAst(expr.right));
  }
}

function parenthesize(value: string, left?: string, right?: string) {
  let str = "";

  str += "(";
  str += value;

  if (left) {
    str += ` ${left}`;
  }

  if (right) {
    str += ` ${right}`;
  }

  str += ")";

  return str;
}
