# generator-tspkg

`tspkg` is a [Yeoman](https://yeoman.io/) generator for TypeScript packages targeted at developer
productivity and best practices.

## Highlights

`tspkg` includes the following:

- TypeScript configuration
- TSLint support
- Prettier support
- Jest support
- TypeDoc website for your project
- Pre-commit and pre-push Git hooks for better CI
- Support for loading environment variables from a .env file during development
- Publishing support for regular packages and CLI tools, with `tspkg` you can choose to:
  - Publish your package as a library, or
  - Publish your package as an executable

## Quick start

To install with Yarn, run:

`yarn install`

To install with NPM, run:

`npm install`

Create an empty directory for your project, `cd` into the newly created directory and run:

`yo tspkg`

Now `tspkg` will ask you a series of questions that tell `tspkg` how to set-up your TypeScript package.
