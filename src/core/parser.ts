// core/parser.ts

import { Token } from './lexer';

type Rule = {
  property: string;
  value: string;
};

const classMap: Record<string, Rule> = {
  'bg-red-500': { property: 'background-color', value: '#f56565' },
  'text-lg': { property: 'font-size', value: '1.125rem' },
  'm-4': { property: 'margin', value: '1rem' },
};

export function parse(tokens: Token[]): string {
  let css = '';

  for (const token of tokens) {
    const rule = classMap[token.value];
    if (rule) {
      css += `.${token.value} { ${rule.property}: ${rule.value}; }\n`;
    }
  }

  return css;
}
