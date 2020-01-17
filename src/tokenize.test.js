// @ts-nocheck
const {
  tokenize,
  singleCharSymbolNames,
  doubleCharSymbolNames,
  whitespaces
} = require("./tokenize");

test("whitespaces", () => {
  for (const whitespace of whitespaces) {
    expect(tokenize(whitespace)).toStrictEqual([]);
  }
  expect(tokenize("\r\n\t")).toStrictEqual([]);
  expect(tokenize("\r\n\t ")).toStrictEqual([]);
  expect(tokenize("\r\n\t \n")).toStrictEqual([]);
});

test("comments", () => {
  expect(tokenize("// crappy comment\n")).toStrictEqual([]);
  expect(tokenize("// crappy comment without newline")).toStrictEqual([]);
  expect(tokenize("/* block of comments */")).toStrictEqual([]);
  expect(tokenize("/* \n newline \t tabs \r\n \r*/")).toStrictEqual([]);
});

test("double character symbols", () => {
  for (const symbol in doubleCharSymbolNames) {
    expect(tokenize(symbol)).toStrictEqual([doubleCharSymbolNames[symbol]]);
  }
});

test("single character symbols", () => {
  for (const symbol in singleCharSymbolNames) {
    expect(tokenize(symbol)).toStrictEqual([singleCharSymbolNames[symbol]]);
  }
});

test("number literals", () => {
  expect(tokenize("1234")).toStrictEqual(["NUMBER"]);
  expect(tokenize("12.3490")).toStrictEqual(["NUMBER"]);
});

// test("invalid characters", () => {
//   const invalidCharacters = "@#$^&|?~`".split("");
//   // TODO:
//   for (const char of invalidCharacters) {
//     console.log({ char });
//     expect(tokenize(char)).toThrowError();
//   }
// });
