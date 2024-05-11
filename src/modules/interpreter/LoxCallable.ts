import { FunctionStmt, Stmt } from "../parser/stmt";
import { VariableStore } from "./VariableStore";

interface Interpreter {
  variableStore: VariableStore;
  executeBlock: (body: Stmt[], variableStore: VariableStore) => void;
}

export interface LoxCallable {
  arity(): number;
  call(interpreter: Interpreter, args: any[]): any;
}

export function isLoxCallable(x: any): x is LoxCallable {
  // null is object :)
  if (x === null) return false;
  if (typeof x !== "object") return false;

  if (x instanceof LoxFunction) {
    return true;
  }

  if ("call" in x && "arity" in x) {
    return true;
  }

  return false;
}

export function createLoxCallable({
  arity,
  call,
}: {
  arity: () => number;
  call: (interpreter: any, args: any[]) => void;
}): LoxCallable {
  return {
    arity,
    call,
  };
}

export class LoxFunction implements LoxCallable {
  declaration: FunctionStmt;
  closure: VariableStore;

  constructor(declaration: FunctionStmt, closure: VariableStore) {
    this.declaration = declaration;
    this.closure = closure;
  }

  arity(): number {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: any[]) {
    let localStore = new VariableStore(this.closure);

    // initialize the params
    this.declaration.params.forEach((param, index) => {
      // TODO: we can support default values here
      localStore.define(param.token.lexeme!, args[index]);
    });

    try {
      interpreter.executeBlock(this.declaration.body, localStore);
    } catch (e: unknown) {
      if (e && typeof e === "object" && "type" in e && "value" in e) {
        return e.value;
      }

      throw e;
    }
  }

  toString() {
    return `<fn ${this.declaration.name.lexeme}>`;
  }
}
