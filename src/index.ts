import { readFile } from "./modules/fs/readFile";
import { readLine } from "./modules/io/readLine";
import { scanTokens } from "./modules/scanner/scanTokens";

async function main() {
  const [_runtime, _binName, commandOrFile] = process.argv;
  const commandTrimmed = commandOrFile.trim();

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

  tokens.forEach((token) => console.log(token));
}

main();
