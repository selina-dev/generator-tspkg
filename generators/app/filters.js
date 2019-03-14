module.exports = {
  filterList,
};

/**
 * Takes a comma separated list of strings and splits the string into an array of strings.
 *
 * @param {string} input - A comma separated list of strings.
 * @returns {Array<string>} - An array of string values.
 *
 * @note A space is allowed after a comma, like with JavaScript arrays.
 * @note Do not quote an array item, unless the item contains quotes.
 */
function filterList(input) {
  return input.split(/, */g);
}
