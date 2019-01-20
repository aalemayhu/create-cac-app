#!/bin/env node

const project = require("./lib/project_setup");

const version = require("./package.json").version;
const cli = require("cac")();

cli.usage("path-to-new-project");
cli.version(version);
cli.help();

const parsed = cli.parse();

const path = parsed.args[0];

if (path) {
  project
    .InitializeRepository(path)
    .then(project.CreateStructure(path))
    .then(() => {
      console.log("Project ready for you at", path);
      console.log("Happy hacking!");
      // TODO: commit it all!

      // Should we ask user questions?
    });
} else {
  cli.outputHelp();
  process.exit(1);
}
