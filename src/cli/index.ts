#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs";
import { runJIT } from "../core/jit";
import { spawn } from "child_process";

runJIT();


const program = new Command();

program
  .name("fl")
  .description("CLI para o FlickCSS")
  .version("0.1.0");

program
  .command("build")
  .description("Gera o CSS com base nas classes encontradas")
  .action(() => {
    console.log(" Gerando CSS com JIT...");
    runJIT();
  });

program
  .command("init")
  .description("Cria o arquivo de configuração padrão")
  .action(() => {
    const configPath = path.resolve(process.cwd(), "flick.config.js");
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(
        configPath,
        `module.exports = {\n  content: ["./public/**/*.html"],\n  output: "./styles/output.css"\n};\n`
      );
      console.log(" flick.config.js criado com sucesso!");
    } else {
      console.log(" flick.config.js já existe.");
    }
  });

program
  .command("watch")
  .description("Assiste mudanças nos arquivos e regenera CSS")
  .action(() => {
    console.log(" Modo observação será implementado aqui futuramente.");
  });

program
  .command("run")
  .description("Executa scripts definidos")
  .argument("<script>", "nome do script como dev, build, start")
  .action((script: string) => {
    console.log(` Executando script '${script}'...`);
    const npm = spawn("npm", ["run", script], { stdio: "inherit" });
    npm.on("close", code => {
      console.log(` Script '${script}' finalizado com código ${code}`);
    });
  });

program.parse(process.argv);
