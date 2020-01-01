function run(source) {
  const tokens = tokenize(source);

  tokens.forEach(token => console.log(token));
}
