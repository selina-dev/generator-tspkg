const validator = require("validator");

const { filters, validators, prompts } = require("@selinarnd/generator-utils");

module.exports = {
  askForBasicProjectDetails,
  askForBuildConfigurations,
  askForApplicationEntryFile,
  askForEnvFileSupport,
};

function askForBasicProjectDetails() {
  return [
    prompts.packageName,
    prompts.projectDescription,
    prompts.projectVersion,
    prompts.githubUsername,
    prompts.repositoryName,
    prompts.repositoryURL,
    prompts.authorName,
    prompts.authorEmail,
    prompts.authorURL,
    prompts.projectLicense,
    prompts.projectIssuesPage,
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
      default: function() {
        return "build";
      },
      filter: filters.filterList,
      validate: validators.validateGlobs,
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
      filter: filters.filterList,
      validate: validators.validateGlobs,
    },
    {
      type: "input",
      name: "exclude",
      message:
        "Files to be excluded from your project build(globs are allowed)",
      default: "node_modules,**/*.spec.ts",
      filter: filters.filterList,
      validate: validators.validateGlobs,
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
      type: "confirm",
      name: "hasEntryFile",
      message: "Does your package has a main entry file?",
      default: true,
    },
    {
      type: "input",
      name: "entryFile",
      message: "Where is the entry file for your application?",
      default: function(answers) {
        return answers.isRunnable ? "build/main.js" : "build/index.js";
      },
      when: function(answers) {
        return answers.hasEntryFile;
      },
      validate: validators.validateFilePath,
    },
    {
      type: "input",
      name: "typeDefinitions",
      message: "What is the path to the package's type definitions?",
      default: function(answers) {
        return answers.isRunnable ? "build/main.d.ts" : "build/index.d.ts";
      },
      when: function(answers) {
        return answers.hasEntryFile;
      },
      validate: validators.validateFilePath,
    },
    {
      type: "confirm",
      name: "hasCommand",
      message:
        "Would you like to expose the entryFile as a global command when this library is installed?",
      default: function() {
        return true;
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
