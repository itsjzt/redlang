export async function readLine(): Promise<string> {
  process.stdout.write(">>> ");

  return new Promise((resolve, reject) => {
    process.stdin.on("data", (lineBuffer) => resolve(lineBuffer.toString()));
  });
}
