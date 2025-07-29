// src/core/jit.ts

import fs from 'fs';
import path from 'path';
import { tokenize } from './lexer.js';
import { parse } from './parser.js';

/**
 * Função principal que compila HTML para CSS.
 */
export function compileFromHtml(html: string): string {
  const tokens = tokenize(html);
  const css = parse(tokens);
  return css;
}

/**
 * Remove regras CSS duplicadas.
 */
function removeDuplicates(css: string): string {
  const seen = new Set<string>();
  return css
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('/*')) return true;
      if (seen.has(trimmed)) return false;
      seen.add(trimmed);
      return true;
    })
    .join('\n');
}

/**
 * Função que roda o compilador a partir de argumentos CLI.
 */
export function runJIT() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('⚠️  Uso: flickcss <caminho-para-html1> [html2 ...] [output.css]');
    process.exit(1);
  }

  // Último argumento pode ser o nome do arquivo de saída se terminar com .css
  const maybeOutput = args[args.length - 1];
  const isCssFile = maybeOutput.endsWith('.css');
  const inputPaths = isCssFile ? args.slice(0, -1) : args;
  const outputPath = isCssFile ? maybeOutput : 'output.css';

  let allCss = '';

  for (const inputPath of inputPaths) {
    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Arquivo não encontrado: ${inputPath}`);
      continue;
    }

    const html = fs.readFileSync(inputPath, 'utf-8');
    const css = compileFromHtml(html);
    allCss += css + '\n';
    console.log(`✔ Processado: ${inputPath}`);
  }

  if (allCss === '') {
    console.warn('⚠️  Nenhum CSS gerado.');
    process.exit(0);
  }

  const finalCss = removeDuplicates(allCss);

  // Garante que o diretório existe
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, finalCss.trim() + '\n');
  console.log(`🎉 CSS final compilado para: ${outputPath}`);
}
