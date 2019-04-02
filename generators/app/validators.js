const semver = require("semver");
const validator = require("validator");

module.exports = {
  validateEmail,
  validateGlob,
  validateGlobs,
  validateSemver,
  validateURL,
  validateFilePath,
};

/**
 * Validate an e-mail address.
 *
 * @param {string} input - E-mail address.
 * @returns {string|true} - An error message if the given string is not a valid e-mail address, true otherwise.
 */
function validateEmail(input) {
  if (!validator.isEmail(input)) {
    return "Please enter a valid e-mail address";
  }

  return true;
}

/**
 * Validate a glob pattern.
 *
 * @param {string} input - A glob pattern.
 * @returns {string|true} - An error message if the given string is not a valid glob pattern, true otherwise.
 */
function validateGlob(input) {
  // In JavaScript, we need to re-create a new regular expression instance for every "test".
  // For more details, see:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#Description
  const globRegex = /(?:\.\/)?((?:[a-zA-Z-_/.*]+))/g;

  if (globRegex.test(input) === false) {
    return `Invalid glob pattern ${input}`;
  }

  return true;
}

/**
 * Validate a list of glob patterns.
 *
 * @param {Array<string>} input - A list of glob patterns.
 * @returns {string|true} -
 *  An error message if one or more strings in the given list are not valid glob patterns, true otherwise.
 */
function validateGlobs(input) {
  for (const glob of input) {
    const validationResult = validateGlob(glob);

    if (typeof validationResult === "string") {
      return validationResult;
    }
  }

  return true;
}

/**
 * Validate a Semantic Versioning 2.0.0 version string.
 *
 * @param {string} input - A version string.
 * @returns {string|true} -
 *  An error message if the given string is not a valid Semantic Versioning 2.0.0 version string, true otherwise.
 */
function validateSemver(input) {
  const parsedVersion = semver.valid(input);

  if (parsedVersion === null) {
    return "Package version must follow Semantic Versioning 2.0.0";
  }

  return true;
}

/**
 * Validate a URL string.
 *
 * @param {string} input - A URL string.
 * @returns {string|true} - An error message if the given string is not a valid URL, true otherwise.
 */
function validateURL(input) {
  if (!validator.isURL(input)) {
    return "Please enter a valid URL";
  }

  return true;
}

/**
 * Validate that a given file path is neither empty or contain spaces.
 *
 * @param {string} input - A file path
 * @returns {string|true} - An error message if the given string is empty or contains space characters, true otherwise.
 *
 * @note This validation function doesn't test for the validaity of the file path
 *       beyond the basic tests mentioned above.
 */
function validateFilePath(input) {
  if (validator.isEmpty(input)) {
    return "Please enter a file path";
  }

  if (/\s/g.test(input)) {
    return "Please make sure that the provided file path doesn't include any white space characters";
  }

  return true;
}
