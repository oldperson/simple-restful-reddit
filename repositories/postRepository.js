const GenericRepository = require('./genericRepository');
const { Post, Sequelize } = require('../orm/models');
const { IdentityNotFoundError } = require('./errors');

/**
 * @class Construct a post repository
 * @param {Object} postModel Set up model to access resources.
 */
class PostRepository extends GenericRepository {
  constructor(postModel) {
    super(postModel || Post);
  }

  /**
   * Create a post under in given community.
   * @param {string} communityName
   * @param {object} post
   * @returns {Promise<object>} { postId }
   */
  createUnder(communityName, post) {
    const { sequelize } = this.sequelizeModel;
    const now = new Date();
    const replacements = Object.assign({
      communityName,
      createdAt: now,
      updatedAt: now,
    }, post);
    const sql = `INSERT INTO 
                   Post (communityId, title, content, authorId, createdAt, updatedAt)
                 SELECT communityId, :title, :content, :authorId, :createdAt, updatedAt
                   FROM  Community WHERE communityName = :communityName;`;

    return sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.INSERT,
    }).then((results) => {
      if (results[1] === 0) { // communityName is not found
        return Promise.reject(new IdentityNotFoundError('community', communityName));
      }
      [replacements.postId] = results;
      return replacements;
    }).catch((error) => {
      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        throw new IdentityNotFoundError('authorId', replacements.authorId);
      }
      throw error;
    });
  }
}

module.exports = PostRepository;
module.exports.instance = new PostRepository();
