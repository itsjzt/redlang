import { readFile } from "./utils/readFile";
import { readLine } from "./utils/readLine";
import { scanTokens } from "./modules/scanner/scanTokens";

async function main() {
  const args = process.argv;

  if (args.length > 2) {
    console.log("Usage: lox [script]");
    return process.exit(64);
  }

  if (args.length > 2) {
    const fileSource = await readFile(args[1]);
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
