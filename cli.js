#!/bin/env node

const cli = require("cac")();
const version = require("./package.json").version;

cli.usage("path-to-new-project");
cli.version(version);
cli.help();

const parsed = cli.parse();

const projectPath = parsed.args[0];

if (!projectPath) {
  cli.outputHelp();
  return;
}

// Should we ask user questions?

console.log("Will create project at", projectPath);
