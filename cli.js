#!/bin/env node

const path = require("path");

const version = require("./package.json").version;
const NodeGit = require("nodegit");
const cli = require("cac")();

cli.usage("path-to-new-project");
cli.version(version);
cli.help();

const parsed = cli.parse();

const projectPath = parsed.args[0];

if (!projectPath) {
  cli.outputHelp();
  process.exit(1);
}

const repoPath = path.resolve(projectPath);
NodeGit.Repository.init(repoPath, 0).then(function(repo) {
  console.log("✅ Initizalized repository at ", repo);
});

// Should we ask user questions?
