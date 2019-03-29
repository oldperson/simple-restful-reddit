const GenericRepository = require('./genericRepository');
const { Vote } = require('../orm/models');

/**
 * @class Construct a vote repository
 * @param {object} voteModel Set up model to access resources.
 */
class VoteRepository extends GenericRepository {
  constructor(voteModel) {
    super(voteModel || Vote);
  }

  /**
   * Create a vote record if the user never vote the post, else update the vote record.
   * @param {object} vote postId, userId is required
   * @returns {Promise<boolean>} success or not
   */
  createOrUpdate(vote) {
    return this.sequelizeModel.upsert(vote);
  }
}
module.exports.GenericRepository = VoteRepository;
module.exports.instance = new VoteRepository();
