const GenericRepository = require('./genericRepository');
const { Post } = require('../orm/models');

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
      [replacements.postId] = results;
      return replacements;
    });
  }
}

module.exports = PostRepository;
module.exports.instance = new PostRepository();
