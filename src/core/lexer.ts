// core/lexer.ts

export type Token = {
  type: string;
  value: string;
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const regex = /[a-z]+(-[a-z0-9]+)+/g;
  const matches = input.match(regex);

  if (matches) {
    for (const match of matches) {
      tokens.push({ type: 'CLASS', value: match });
    }
  }

  return tokens;
}
