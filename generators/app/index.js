const Generator = require("yeoman-generator");

const asciiart = require("./asciiart");
const { initializeGitRepository } = require("./utils/git");

const {
  askForBasicProjectDetails,
  askForBuildConfigurations,
  askForApplicationEntryFile,
  askForEnvFileSupport,
} = require("./prompts");

module.exports = class extends Generator {
  get initializing() {
    return {
      printWelcomeMessage() {
        this.log("\n" + asciiart.KITTY);
        this.log(
          "In just a few minutes from now you'll have a fully configured scaffold of a TypeScript package.",
        );
      },
    };
  }

  async prompting() {
    this.answers = await this.prompt([
      ...askForBasicProjectDetails(),
      ...askForBuildConfigurations(),
      ...askForApplicationEntryFile(),
      ...askForEnvFileSupport(),
    ]);
  }

  get configuring() {
    return {
      configurePkgJson() {
        this.fs.copyTpl(
          this.templatePath("package.json.ejs"),
          this.destinationPath("package.json"),
          {
            name: this.answers.name,
            description: this.answers.description,
            version: this.answers.version,
            repository: this.answers.repository,
            author: this.answers.author,
            license: this.answers.license,
            bugs: this.answers.bugs,
            files: this.answers.files,
            isRunnable: this.answers.isRunnable,
            entryFile: this.answers.entryFile,
            hasCommand: this.answers.hasCommand,
            command: this.answers.command,
            hasEnvFile: this.answers.hasEnvFile,
          },
        );
      },

      configureTypeScriptCompilation() {
        this.fs.copyTpl(
          this.templatePath("tsconfig.json.ejs"),
          this.destinationPath("tsconfig.json"),
          {
            include: this.answers.include,
            exclude: this.answers.exclude,
          },
        );
      },

      configureTSLint() {
        this.fs.copyTpl(
          this.templatePath("tslint.json.ejs"),
          this.destinationPath("tslint.json"),
        );
      },

      configurePrettier() {
        this.fs.copyTpl(
          this.templatePath(".prettierrc.ejs"),
          this.destinationPath(".prettierrc"),
        );
        this.fs.copyTpl(
          this.templatePath(".prettierignore.ejs"),
          this.destinationPath(".prettierignore"),
        );
      },

      configureIndexTSFile() {
        const { sourceDir, version } = this.answers;

        this.fs.copyTpl(
          this.templatePath("lib/index.ts.ejs"),
          this.destinationPath(`${sourceDir}/index.ts`),
          { version },
        );
      },

      configureEntryFile() {
        const { isRunnable, entryFile } = this.answers;

        if (isRunnable) {
          this.fs.copyTpl(
            this.templatePath("lib/main.ts.ejs"),
            this.destinationPath(entryFile),
          );
        }
      },

      configureTestFramework() {
        const { sourceDir } = this.answers;

        this.fs.copyTpl(
          this.templatePath("jest.config.js.ejs"),
          this.destinationPath("jest.config.js"),
          { sourceDir },
        );

        this.fs.copyTpl(
          this.templatePath("tsconfig.test.json.ejs"),
          this.destinationPath("tsconfig.test.json"),
        );
      },

      configureTestFrameworkSetup() {
        this.fs.copyTpl(
          this.templatePath("tests/setup.ts.ejs"),
          this.destinationPath("tests/setup.ts"),
          { hasEnvFile: this.answers.hasEnvFile },
        );
      },

      configureSampleTest() {
        const { sourceDir } = this.answers;

        this.fs.copyTpl(
          this.templatePath("tests/unit/version.spec.ts.ejs"),
          this.destinationPath("tests/unit/version.spec.ts"),
          { sourceDir },
        );
      },

      configureProjectReadme() {
        this.fs.copyTpl(
          this.templatePath("README.md.ejs"),
          this.destinationPath("README.md"),
          { name: this.answers.name },
        );
      },

      configureGitHooks() {
        this.fs.copyTpl(
          this.templatePath(".huskyrc.json.ejs"),
          this.destinationPath(".huskyrc.json"),
        );
        this.fs.copyTpl(
          this.templatePath(".lintstagedrc.ejs"),
          this.destinationPath(".lintstagedrc"),
        );
      },

      configureEnvFile() {
        const hasEnvFile = this.answers.hasEnvFile;

        if (hasEnvFile) {
          this.fs.copyTpl(
            this.templatePath(".env.ejs"),
            this.destinationPath(".env"),
          );
        }
      },

      configureGitIgnore() {
        this.fs.copyTpl(
          this.templatePath(".gitignore.ejs"),
          this.destinationPath(".gitignore"),
        );
      },
    };
  }

  get install() {
    return {
      installProjectDependencies() {
        const dependencies = ["reflect-metadata"];

        const devDependencies = [
          "@types/jest",
          "@types/node",
          "cross-env",
          "husky",
          "jest",
          "lint-staged",
          "prettier",
          "rimraf",
          "ts-jest",
          "ts-loader",
          "ts-node",
          "tslint",
          "tslint-config-prettier",
          "typedoc",
          "typescript",
        ];

        if (this.answers.hasEnvFile) {
          devDependencies.push("dotenv", "@types/dotenv");
        }

        this.yarnInstall(dependencies);
        this.yarnInstall(devDependencies, { dev: true });
      },
    };
  }

  get end() {
    return {
      runFormatter() {
        this.spawnCommandSync("yarn", ["format"]);
      },

      createGitRepositoryForProject() {
        return initializeGitRepository(process.cwd(), {
          author: {
            name: this.user.git.name(),
            email: this.user.git.email(),
          },
        });
      },
    };
  }
};
