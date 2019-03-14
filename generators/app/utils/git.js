const Git = require("nodegit");

module.exports = {
  initializeGitRepository,
};

/**
 * Create a new repository, add all files and create an "init" commit.
 *
 * @param {string} pathToRepository - Path to git repository, defaults to `process.cwd()`
 * @param {Object} commitMetadata - Metadata about the initial commit
 * @param {Object} commitMetadata.author - Author details for the initial commit commit
 * @param {string} commitMetadata.author.name - Author name
 * @param {string} commitMetadata.author.email - Author email
 * @returns {Git.Oid} - Git Object ID of the initial commit
 */
async function initializeGitRepository(
  pathToRepository = process.cwd(),
  commitMetadata,
) {
  const repository = await Git.Repository.init(pathToRepository, 0);

  const index = await repository.refreshIndex();
  await index.addAll();
  await index.write();

  const treeObjectID = await index.writeTree();

  const { author } = commitMetadata;

  const authorSignature = Git.Signature.now(author.name, author.email);
  const commiterSignature = Git.Signature.now(author.name, author.email);

  return repository.createCommit(
    "HEAD",
    authorSignature,
    commiterSignature,
    "init",
    treeObjectID,
    [],
  );
}
