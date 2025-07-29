// core/parser.ts

import { Token } from './lexer.js';

type Rule = {
  property: string;
  value: string;
};

// Regras estáticas pré-definidas
const classMap: Record<string, Rule> = {
  'bg-red-500': { property: 'background-color', value: '#f56565' },
  'text-lg': { property: 'font-size', value: '1.125rem' },
  'm-4': { property: 'margin', value: '1rem' },
};

// Função auxiliar para lidar com tokens JIT dinâmicos como [color:red]
function parseDynamicToken(value: string): Rule | null {
  const match = value.match(/^\[(.+?):(.+?)\]$/);
  if (!match) return null;

  const [_, prop, val] = match;

  // Mapeia propriedades abreviadas, se desejar
  const propertyMap: Record<string, string> = {
    color: 'color',
    bg: 'background-color',
    'bg-color': 'background-color',
    'font-size': 'font-size',
    padding: 'padding',
    margin: 'margin',
  };

  const property = propertyMap[prop] || prop;

  return {
    property,
    value: val
  };
}

export function parse(tokens: Token[]): string {
  let css = '';

  for (const token of tokens) {
    if (token.type === 'COMMENT' || token.type === 'WHITESPACE') {
      continue; // Ignorar comentários e espaços
    }

    // Exemplo: .bg-red-500
    if (token.type === 'CLASS' || token.type === 'IDENT') {
      const rule = classMap[token.value];
      if (rule) {
        css += `.${token.value} { ${rule.property}: ${rule.value}; }\n`;
      }
    }

    // Exemplo: bg-[color:red]
    if (token.type === 'DYNAMIC') {
      const dynamicRule = parseDynamicToken(token.value.slice(1, -1)); // remove os colchetes
      if (dynamicRule) {
        css += `/* dynamic */\n`;
        css += `.dynamic-${token.value.slice(1, -1).replace(/[^a-z0-9]/gi, '-')}`
             + ` { ${dynamicRule.property}: ${dynamicRule.value}; }\n`;
      }
    }

    // Futuro: suporte para @apply, @media, etc.
    if (token.type === 'KEYWORD') {
      css += `/* Keyword ${token.value} encontrada (sem tratamento) */\n`;
    }
  }

  return css;
}
