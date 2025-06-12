#!/usr/bin/env node

// Minimal command-line interface for the library.
// Provides scalable sub-commands (parse, validate, …) via the Commander.js API.
// Usage:
//   $ qris-utils parse "<string>"
//   $ qris-utils validate "<string>"

import { Command } from "commander";
import chalk from "chalk";
import { createRequire } from "node:module";
import { parseQris, validateQris } from "./index";

// Dynamically read package version so "qris-utils --version" always matches lib version
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

// Instantiate the CLI program
const program = new Command();

program
  .name("qris-utils")
  .description(
    "Parse, validate and generate QRIS strings (Quick Response Code Indonesian Standard)"
  )
  .version(version, "-v, --version", "output the current version");

// parse command
program
  .command("parse <qris>")
  .description("Parse a QRIS string and output its AST as prettified JSON")
  .action((qris: string) => {
    try {
      const ast = parseQris(qris);
      console.log(JSON.stringify(ast, null, 2));
    } catch (err) {
      console.error(chalk.red((err as Error).message));
      process.exit(1);
    }
  });

// validate command
program
  .command("validate <qris>")
  .description("Validate a QRIS string and report any errors")
  .action((qris: string) => {
    const result = validateQris(qris);
    console.log("");
    if (result.valid) {
      console.log(chalk.green("✔ QRIS string is valid."));
    } else {
      console.error(chalk.red("✖ QRIS string is invalid. Errors:"));
      for (const err of result.errors) {
        console.error(chalk.red(`  • ${err.message}`));
      }
      process.exit(1);
    }
  });

// Placeholder for future scalable commands (e.g., generate, checksum, etc.)

// Parse CLI arguments
program.parseAsync(process.argv);
