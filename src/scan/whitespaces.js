function whitespaces({ char, index, source }) {
  switch (char) {
    case " ":
      return { token: null, index: index + 1 };

    case "\t":
      return { token: null, index: index + 1 };

    case "\n":
      return { token: null, index: index + 1 };
  }
}

module.exports = { whitespaces };
