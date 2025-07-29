// core/lexer.ts

export type Token = {
  type: string;
  value: string;
};

const tokenPatterns: [RegExp, string][] = [
  [/^\/\/.*/, 'COMMENT'],                         // Comentário de linha
  [/^\/\*[\s\S]*?\*\//, 'COMMENT'],               // Comentário de bloco
  [/^@[a-zA-Z_]+/, 'KEYWORD'],                    // Palavras-chave tipo @if, @use
  [/^#[a-fA-F0-9]{3,6}/, 'COLOR'],                // Cores hexadecimais
  [/^rgba?\([^)]*\)/, 'COLOR'],                   // Cores rgba(...)
  [/^"[^"]*"|^'[^']*'/, 'STRING'],                // Strings com aspas
  [/^\[[^\]]*\]/, 'DYNAMIC'],                     // Tokens dinâmicos tipo [color:red]
  [/^[a-z]+(-[a-z0-9]+)+/, 'CLASS'],              // Classes com hífen (ex: bg-blue)
  [/^[0-9]+(\.[0-9]+)?(px|rem|em|vh|vw|%)?/, 'NUMBER'], // Números com unidade
  [/^[a-zA-Z_][a-zA-Z0-9_]*/, 'IDENT'],           // Identificadores simples
  [/^[{}():;=.,]/, 'SYMBOL'],                     // Símbolos diversos
  [/^\s+/, 'WHITESPACE']                          // Espaços e quebras de linha
];

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let code = input;

  while (code.length > 0) {
    let matched = false;

    for (const [regex, type] of tokenPatterns) {
      const match = code.match(regex);
      if (match) {
        const value = match[0];

        // Ignora espaços, mas reconhece como delimitadores
        if (type !== 'WHITESPACE') {
          tokens.push({ type, value });
        }

        code = code.slice(value.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      throw new Error(`Token inesperado: "${code.slice(0, 10)}..."`);
    }
  }

  return tokens;
}
