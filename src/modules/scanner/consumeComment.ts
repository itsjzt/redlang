export function consumeComment(source: string): number {
  const expectedChar = "\n";
  let i = 0;
  for (; i < source.length; i++) {
    const currentChar = source[i];
    if (currentChar === expectedChar) {
      return i;
    }
  }

  // return the last token if not found
  // because in our use case we consumed everything
  // in search of this character
  return i;
}
