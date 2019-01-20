const fs = require("fs");
const path = require("path");

const NodeGit = require("nodegit");
var replace = require("replace");
const execa = require("execa");

const structure = {
  ".gitignore":
    "https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore",
  "package.json":
    "https://raw.githubusercontent.com/scanf/base-cli-node/master/package.json",
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
const curlIt = function(path, url) {
  return execa("curl", ["-o", path, url]);
};

/*
 * TODO: should we have a fallback when creating new project offline
 * Maybe we can cache the repository in .cache/my-cac? So instead of
 * curl it would then try to fetch latest changes before fs copy.
 */
const CreateStructure = function(projectPath) {
  return new Promise(function(resolve, reject) {
    if (!projectPath) {
      reject(`Expected a project name got, ${projectPath}`);
    } else {
      (async () => {
        for (var key in structure) {
          const url = structure[key];
          await curlIt(`${projectPath}/${key}`, url);
        }

        const libDir = path.join(projectPath, "lib");
        if (fs.existsSync(libDir) === false) {
          fs.mkdirSync(libDir);
        }

        const projectName = path.basename(projectPath);

        replace({
          regex: "(name)",
          replacement: projectName,
          paths: [projectPath],
          recursive: true,
          silent: true
        });

        await execa("yarn", ["--cwd", projectPath, "add", "cac"]);
        await execa("yarn", ["--cwd", projectPath, "install"]);

        // TODO: use nodegit https://github.com/nodegit/nodegit/blob/master/examples/add-and-commit.js
        const commit = async () => {
          await execa("git", ["-C", projectPath, "add", "-A"]);
          await execa("git", [
            "-C",
            projectPath,
            "commit",
            "-m",
            "Initialized project"
          ]);
        };

        const readme = path.join(projectPath, "README.md");
        fs.writeFile(
          readme,
          `# ${projectName}

TODO: add some content in here and review your package.json file 😉
          `,
          err => {
            if (err) {
              console.log(err);
            }
            commit();
            resolve();
          }
        );
      })();
    }
  });
};

module.exports = {
  InitializeRepository,
  CreateStructure
};
