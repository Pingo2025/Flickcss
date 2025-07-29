// core/jit.ts

import fs from 'fs';
import { tokenize } from './lexer';
import { parse } from './parser';

export function compileFromHtml(html: string): string {
  const tokens = tokenize(html);
  const css = parse(tokens);
  return css;
}

// Exemplo de uso
const htmlSample = `<div class="bg-red-500 text-lg m-4">Hello World</div>`;
const cssResult = compileFromHtml(htmlSample);

fs.writeFileSync('output.css', cssResult);
console.log('✔ CSS compilado para output.css');
