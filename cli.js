#!/bin/env node

const path = require("path");
const fs = require("fs");

const version = require("./package.json").version;
const npm = require("npm-programmatic");
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

const gitDir = path.join(repoPath, ".git");
if (fs.existsSync(gitDir) === true) {
  console.log("🚨 Found a git repository at", gitDir);
  process.exit(1);
}

NodeGit.Repository.init(repoPath, 0).then(function(repo) {
  console.log("Initizalized repository at", repoPath);

  const projectName = path.basename(projectPath);
  console.log("Project name", projectName);
  npm
    .install(["cac"], {
      cwd: repoPath,
      save: true
    })
    .then(function() {
      console.log("✅ Installed cac");
      console.log(`
      Now you can run
      curl -o ${projectPath}/.gitignore https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore
      yarn --cwd ${projectPath} init
      yarn --cwd ${projectPath} install
      `);
    })
    .catch(function(err) {
      if (err) console.log("Error ", err.toString());
    });
});

// Should we ask user questions?
