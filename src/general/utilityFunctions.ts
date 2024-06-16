export const guid = (): string => {
  const gen = (n?: number): string => {
    const rando = (): string =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    let r = '';
    let i = 0;
    n = n || 1;
    while (i < n) {
      r += rando();
      i += 1;
    }
    return r;
  };
  return `${gen(2)}-${gen()}-${gen()}-${gen()}-${gen(3)}`;
};
