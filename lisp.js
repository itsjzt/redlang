function parse(sourceCode) {
  return sourceCode.replace("(", " ( ").replace(")", " ) ").split(" ");
}

console.log(parse(process.argv[2]));
