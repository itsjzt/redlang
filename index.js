function main(...args) {
  if (!args.length) {
    console.log("Usage: lox [script]");
    process.exit(64);
  } else if (args.length > 1) {
    runFile(args.splice(1));
  } else {
    runPrompt();
  }
}
