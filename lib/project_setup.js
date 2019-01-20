const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");

const NodeGit = require("nodegit");
const execa = require("execa");

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

      const readme = path.join(projectPath, "README.md");
      const txt = `# ${projectName}\n\nadd some content in here and review your package.json file 😉`;
      fs.writeFileSync(readme, txt);

      const nvmrc = path.join(projectPath, ".nvmrc");
      fs.writeFileSync(nvmrc, "10.15.0");
      resolve();
    }
  });
};

module.exports = {
  InitializeRepository,
  CreateStructure
};
