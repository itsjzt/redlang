import { interpretAst } from "./modules/interpreter/interpretAst";
import { readFile } from "./modules/io/readFile";
import { readLine } from "./modules/io/readLine";
import { Expr } from "./modules/parser/expr";
import { Stmt } from "./modules/parser/stmt";
import { parseTokens } from "./modules/parser/parseTokens";
import { prettifyAst } from "./modules/parser/prettifyAst";
import { scanTokens } from "./modules/scanner/scanTokens";
import { hadError, hadRuntimeError } from "./throwError";

async function main() {
  const [_runtime, _binName, commandOrFile] = process.argv;
  const commandTrimmed = commandOrFile?.trim();

  if (commandTrimmed === "--help") {
    console.log("Usage: lox [script]");
    return process.exit(64);
  }

  if (commandTrimmed) {
    const fileSource = await readFile(commandTrimmed);
    run(fileSource);

    if (hadRuntimeError) {
      return process.exit(70);
    }

    return process.exit(0);
  }

  for (;;) {
    const line = await readLine();

    run(line);
  }
}

function run(source: string) {
  const tokens = scanTokens(source);
  const ast = parseTokens(tokens);

  if (hadError || !ast) {
    return;
  }

  interpret(ast);
}

function interpret(expr: Stmt[]) {
  try {
    interpretAst(expr);
  } catch (e) {
    // console.log()
  }
}

main();
