const GenericRepository = require('./genericRepository');
const { IdentityNotFoundError, isForeignKeyError } = require('./errors');
/**
 * @class Construct a vote repository
 * @param {object} voteModel Set up model to access resources.
 */
class VoteRepository extends GenericRepository {
  /**
   * Create a vote record if the user never vote the post, else update the vote record.
   * @param {object} vote postId, userId is required
   * @returns {Promise<boolean>} success or not,
   * In MySQL return true for inserted, false for updated,
   * <pre><code>return [result === 1, undefined];</code></pre>
   * http://dev.mysql.com/doc/refman/5.0/en/insert-on-duplicate.html.
   */
  createOrUpdate(vote) {
    return this.sequelizeModel.upsert(vote)
      .catch((error) => {
        if (isForeignKeyError(error)) {
          return Promise.reject(new IdentityNotFoundError({
            postId: vote.postId,
            userId: vote.userId,
          }));
        }
        return Promise.reject(error);
      });
  }
}
module.exports.VoteRepository = VoteRepository;
