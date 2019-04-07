const GenericRepository = require('./genericRepository');
const { IdentityNotFoundError } = require('./errors');
/**
 * @class Construct a vote repository
 * @param {object} voteModel Set up model to access resources.
 */
class VoteRepository extends GenericRepository {
  /**
   * Create a vote record if the user never vote the post, else update the vote record.
   * @param {object} vote postId, userId is required
   * @returns {Promise<boolean>} success or not
   */
  createOrUpdate(vote) {
    return this.sequelizeModel.upsert(vote)
      .catch((error) => {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
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
