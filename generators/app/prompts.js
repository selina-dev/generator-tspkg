const path = require("path");

const validator = require("validator");

const { filterList } = require("./filters");
const {
  validateEmail,
  validateGlobs,
  validateSemver,
  validateURL,
} = require("./validators");

module.exports = {
  askForBasicProjectDetails,
  askForBuildConfigurations,
  askForApplicationEntryFile,
  askForEnvFileSupport,
};

function askForBasicProjectDetails() {
  return [
    {
      type: "input",
      name: "name",
      message: "Choose a name for your package",
      default: path.basename(process.cwd()), // Name of project directory
      validate: function(input) {
        if (/^(@[a-z]+\/)?[a-z-]+$/g.test(input) === false) {
          return "Package name must be a valid NPM package name";
        }

        return true;
      },
    },
    {
      type: "input",
      name: "description",
      message: "How you would describe your project in one sentence?",
    },
    {
      type: "input",
      name: "version",
      message: "Choose a version number for your package",
      default: "1.0.0",
      validate: validateSemver,
    },
    {
      type: "input",
      name: "repository",
      message: "URL of Git repository for this project",
      validate: function(input) {
        return validator.isEmpty(input) || validateURL(input);
      },
    },
    {
      type: "input",
      name: "author.name",
      message: "Author name",
      validate: function(input) {
        if (validator.isEmpty(input)) {
          return "Please enter author name";
        }

        if (/[A-Z]([A-Za-z ]+)/g.test(input) === false) {
          return "Author name must start with a capital letter and may only contain english letters and spaces";
        }

        return true;
      },
    },
    {
      type: "input",
      name: "author.email",
      message: "Author email",
      validate: function(input) {
        return validator.isEmpty(input) || validateEmail(input);
      },
    },
    {
      type: "input",
      name: "author.url",
      message: "Author website URL",
      validate: function(input) {
        return validator.isEmpty(input) || validateURL(input);
      },
    },
    {
      type: "input",
      name: "license",
      message: "Choose a license for your package(default to no license)",
    },
    {
      type: "input",
      name: "bugs",
      message: "Where to submit bugs?(e.g., a Github issues page)",
      validate: function(input) {
        return validator.isEmail(input) || validateURL(input);
      },
    },
    {
      type: "input",
      name: "sourceDir",
      message: "Name of source directory",
      default: "lib",
    },
    {
      type: "input",
      name: "files",
      message: "Files to include in package distributions",
      default: function(answers) {
        return `${answers.sourceDir},package.json,yarn.lock`;
      },
      filter: filterList,
      validate: validateGlobs,
    },
  ];
}

function askForBuildConfigurations() {
  return [
    {
      type: "input",
      name: "include",
      message:
        "Files to be included in your project build(globs are allowed)." +
        "Use commas to separate multiple globs.",
      default: function(answers) {
        return `${answers.sourceDir}/**/*`;
      },
      filter: filterList,
      validate: validateGlobs,
    },
    {
      type: "input",
      name: "exclude",
      message:
        "Files to be excluded from your project build(globs are allowed)",
      default: "node_modules,**/*.spec.ts",
      filter: filterList,
      validate: validateGlobs,
    },
  ];
}

function askForApplicationEntryFile() {
  return [
    {
      type: "confirm",
      name: "isRunnable",
      message: "Is your package meant to run as an executable?",
      default: false,
    },
    {
      type: "input",
      name: "entryFile",
      message: "Where is the entry file for your application?",
      default: function(answers) {
        return `${answers.sourceDir}/main.ts`;
      },
      when: function(answers) {
        return answers.isRunnable;
      },
      validate: function(input) {
        if (validator.isEmpty(input)) {
          return "Please enter a file path";
        }

        if (/\s/g.test(input)) {
          return "Please make sure that the provided file path doesn't include any white space characters";
        }

        return true;
      },
    },
    {
      type: "confirm",
      name: "hasCommand",
      message:
        "Would you like to expose the entryFile as a global command when this library is installed?",
      default: function(answers) {
        return answers.isRunnable;
      },
      when: function(answers) {
        return answers.isRunnable;
      },
    },
    {
      type: "input",
      name: "command",
      message: "Give your command a name",
      when: function(answers) {
        return answers.hasCommand;
      },
      validate: function(input) {
        if (validator.isEmpty(input)) {
          return "Please enter a command name";
        }

        if (input.length === 1) {
          return "Command name should consist of at least 2 characters";
        }

        if (/^[a-z][a-z-]+$/g.test(input) === false) {
          return "Command name can only include lowercased letters and dashes";
        }

        return true;
      },
    },
  ];
}

function askForEnvFileSupport() {
  return [
    {
      type: "confirm",
      name: "hasEnvFile",
      message: "Create a default .env file?",
      default: false,
    },
  ];
}
