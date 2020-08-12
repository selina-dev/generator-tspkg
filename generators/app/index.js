const Generator = require("yeoman-generator");

const { asciiArt, gitUtils } = require("@selinarnd/generator-utils");

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
        this.log("\n" + asciiArt.KITTY);
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
            package: this.answers.package,
            description: this.answers.description,
            version: this.answers.version,
            repository: this.answers.repository,
            author: this.answers.author,
            license: this.answers.license,
            bugs: this.answers.bugs,
            files: this.answers.files,
            isRunnable: this.answers.isRunnable,
            hasEntryFile: this.answers.hasEntryFile,
            entryFile: this.answers.entryFile,
            typeDefinitions: this.answers.typeDefinitions,
            hasCommand: this.answers.hasCommand,
            command: this.answers.command,
            hasEnvFile: this.answers.hasEnvFile,
          },
        );
      },

      configureTypeScriptCompilation() {
        this.fs.copyTpl(
          this.templatePath("tsconfig.base.json.ejs"),
          this.destinationPath("tsconfig.base.json"),
        );

        this.fs.copyTpl(
          this.templatePath("tsconfig.build.json.ejs"),
          this.destinationPath("tsconfig.build.json"),
          {
            include: this.answers.include,
            exclude: this.answers.exclude,
          },
        );

        this.fs.copy(
          this.templatePath("tsconfig.test.json"),
          this.destinationPath("tsconfig.test.json"),
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
        const { sourceDir } = this.answers;

        this.fs.copy(
          this.templatePath("lib/index.ts"),
          this.destinationPath(`${sourceDir}/index.ts`),
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
      },

      configureTestFrameworkSetup() {
        this.fs.copyTpl(
          this.templatePath("tests/setup.ts.ejs"),
          this.destinationPath("tests/setup.ts"),
        );
        this.fs.copy(
          this.templatePath("tests/sample-test-suite.spec.ts"),
          this.destinationPath("tests/sample-test-suite.spec.ts"),
        );
      },

      configureProjectReadme() {
        this.fs.copyTpl(
          this.templatePath("README.md.ejs"),
          this.destinationPath("README.md"),
          { package: this.answers.package },
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
        const devDependencies = [
          "@types/jest",
          "@types/node",
          "cross-env",
          "husky",
          "jest",
          "jest-junit",
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
        return gitUtils.initializeGitRepository(process.cwd(), {
          author: {
            name: this.user.git.name(),
            email: this.user.git.email(),
          },
        });
      },

      initializeGitHooks() {
        this.yarnInstall("husky");
      },
    };
  }
};
