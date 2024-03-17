import { readFile } from "./modules/io/readFile";
import { readLine } from "./modules/io/readLine";
import { parseTokens } from "./modules/parser/parseTokens";
import { prettifyAst } from "./modules/parser/prettifyAst";
import { scanTokens } from "./modules/scanner/scanTokens";
import { hadError } from "./throwError";

async function main() {
  const [_runtime, _binName, commandOrFile] = process.argv;
  const commandTrimmed = commandOrFile?.trim();

  if (commandTrimmed === "--help") {
    console.log("Usage: lox [script]");
    return process.exit(64);
  }

  if (commandTrimmed) {
    const fileSource = await readFile(commandTrimmed);
    return run(fileSource);
  }

  for (;;) {
    const line = await readLine();

    run(line);
  }
}

function run(source: string) {
  const tokens = scanTokens(source);
  const ast = parseTokens(tokens);

  if (hadError) {
    return;
  }

  if (ast) {
    console.log(prettifyAst(ast));
  }
}

main();
