const tokens = require("./tokens");

function maths({ char, index, source }) {
  switch (char) {
    case "-":
      return {
        token: tokens.MINUS,
        index: index + 1
      };

    case "+":
      return {
        token: tokens.PLUS,
        index: index + 1
      };

    case "/":
      return {
        token: tokens.SLASH,
        index: index + 1
      };

    case "*":
      return {
        token: tokens.STAR,
        index: index + 1
      };
  }
}

module.exports = { maths };
