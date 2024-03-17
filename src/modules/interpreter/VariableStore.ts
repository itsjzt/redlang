import { throwRuntimeError } from "../../throwError";
import { Token } from "../scanner/token";

export class VariableStore {
  variables = new Map<string, any>();
  // parent scope
  enclosing: null | VariableStore = null;

  constructor(enclosing: VariableStore | null) {
    this.enclosing = enclosing;
  }

  contains(name: Token): boolean {
    const value = this.variables.get(name.lexeme!);

    if (value) {
      return true;
    }

    if (this.enclosing !== null) {
      return this.enclosing.contains(name);
    }

    return false;
  }

  assign(name: Token, value: any): unknown {
    const isDeclared = this.variables.has(name.lexeme!);

    if (isDeclared) {
      return this.variables.set(name.lexeme!, value);
    }

    if (this.enclosing !== null) {
      return this.enclosing.assign(name, value);
    }

    throwRuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  get(name: Token): any | never {
    const value = this.variables.get(name.lexeme!);

    if (value) {
      return value;
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throwRuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }

  define(name: string, value: any) {
    this.variables.set(name, value);
  }
}
