import { Stmt, VarStmt } from "../parser/stmt";

export function typechecker(ast: Stmt[]) {
  for (let i = 0; i < ast.length; i++) {
    const astLine = ast[i];

    switch (astLine.type) {
      case "VarStmt":
        checkVariableTypes(astLine);
        break;
    }
  }
}

function checkVariableTypes(astNode: VarStmt) {}
