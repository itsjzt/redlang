const nodeReadline = require("node:readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function readLine(): Promise<string> {
  return new Promise((resolve) =>
    nodeReadline.question(">>> ", (input: string) => {
      resolve(input);
    })
  );
}
