const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");

const NodeGit = require("nodegit");

const structure = {
  ".gitignore":
    "https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore",
  LICENSE:
    "https://raw.githubusercontent.com/scanf/base-cli-node/master/LICENSE"
};

const InitializeRepository = function(projectPath) {
  const repoPath = path.resolve(projectPath);
  const gitDir = path.join(repoPath, ".git");

  if (fs.existsSync(gitDir) === true) {
    console.log("🚨 Found a git repository at", gitDir);
    process.exit(1);
  }

  console.log("Initizalized repository at", repoPath);
  return NodeGit.Repository.init(repoPath, 0);
};

const createFileSync = function(path, content) {
  fs.writeFileSync(path, content);
};

const CreateStructure = function(projectPath) {
  return new Promise(function(resolve, reject) {
    if (!projectPath) {
      reject(`Expected a project name got, ${projectPath}`);
    } else {
      for (var key in structure) {
        const url = structure[key];
        execSync(`curl -o ${projectPath}/${key} ${url}`);
      }

      const libDir = path.join(projectPath, "lib");
      if (fs.existsSync(libDir) === false) {
        fs.mkdirSync(libDir);
      }

      const projectName = path.basename(projectPath);

      const yarnPrefix = `yarn --cwd ${projectPath}`;
      execSync(`${yarnPrefix} init`, {
        stdio: "inherit"
      });
      execSync(`${yarnPrefix} add cac`, { stdio: "inherit" });
      execSync(`${yarnPrefix} install`, { stdio: "inherit" });
      execSync(`git -C ${projectPath} add -A`, { stdio: "inherit" });
      execSync(`git -C ${projectPath} commit -m "Initialized project"`, {
        stdio: "inherit"
      });

      createFileSync(
        path.join(projectPath, "README.md"),
        `# ${projectName}\n\nadd some content in here and review your package.json file 😉`
      );
      createFileSync(path.join(projectPath, ".nvmrc"), "10.15.0");
      createFileSync(
        path.join(projectPath, ".eslintrc.js"),
        `module.exports = {
  env: {
    node: true,
    commonjs: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-console": 0
  }
};`
      );

      createFileSync(
        path.join(projectPath, "cli.js"),
        `#!/usr/bin/env node

const version = require("./package.json").version;
const cli = require("cac")();

cli.usage("describe it here...");
cli.version(version);
cli.help();

const parsed = cli.parse();

console.log(parsed);
`
      );

      resolve();
    }
  });
};

module.exports = {
  InitializeRepository,
  CreateStructure
};
