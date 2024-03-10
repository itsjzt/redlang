import { Expr } from "./expr";

export function prettyPrint(expr: Expr): string {
  switch (expr.type) {
    case "Binary":
      return parenthesize(
        expr.operator.lexeme!,
        prettyPrint(expr.left),
        prettyPrint(expr.right)
      );
    case "Group":
      return parenthesize("grouping", prettyPrint(expr.expr));
    case "Literal":
      if (expr.value) {
        return expr.value.toString();
      }
      return "nil";
    case "Unary":
      return parenthesize(expr.operator.lexeme!, prettyPrint(expr.right));
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

// console.log(
//   prettyPrint(
//     createBinaryExpr(
//       createToken("STAR", "*", null, 0),
//       createLiteralExpr(32),
//       createBinaryExpr(
//         createToken("PLUS", "+", null, 0),
//         createLiteralExpr(78),
//         createLiteralExpr(12389)
//       )
//     )
//   )
// );
