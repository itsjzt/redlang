import { interpret } from "./modules/interpreter/interpret";
import { readFile } from "./modules/io/readFile";
import { readLine } from "./modules/io/readLine";
import { Stmt } from "./modules/parser/stmt";
import { parse } from "./modules/parser/parse";
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
  const ast = parse(tokens);

  // console.log(JSON.stringify(ast, null, 2));

  if (hadError || !ast) {
    return;
  }

  interpretWithCatch(ast);
}

function interpretWithCatch(expr: Stmt[]) {
  try {
    interpret(expr);
  } catch (e) {
    // console.log()
  }
}

main();
