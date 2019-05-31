const GenericRepository = require('./genericRepository');
// const { IdentityNotFoundError, isForeignKeyError } = require('../repositories/errors');
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
    const conditions = {
      postId: vote.postId,
      userId: vote.userId,
    };
    return this.mongooseModel
      .findOneAndUpdate(conditions, { value: vote.value }, { upsert: true, new: true })
      .exec()
      .then((result) => {
        if (!result) {
          throw new Error(`expect result to be returned when findOneAndUpdate: ${JSON.stringify(vote)}, but there no result returned`);
        }
        return result.toJSON();
      });
  }
}
module.exports.VoteRepository = VoteRepository;
