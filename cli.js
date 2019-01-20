#!/usr/bin/env node

const project = require("./lib/project_setup");
const version = require("./package.json").version;
const cli = require("cac")();
const chalk = require("chalk");

cli.usage("path-to-new-project");
cli.version(version);
cli.help();

const parsed = cli.parse();

const path = parsed.args[0];
// TODO: Should we ask user questions?
if (path) {
  project
    .InitializeRepository(path)
    .then(project.CreateStructure(path))
    .then(() => {
      console.log("Project ready for you at", chalk.green.underline(path));
    });
} else {
  cli.outputHelp();
  process.exit(1);
}
