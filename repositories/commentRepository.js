const GenericRepository = require('./genericRepository');
const { Comment } = require('../orm/models');

/**
 * @class Construct a comment repository
 * @param {Object} commentModel Set up model to access resources.
 */
class CommentReposotory extends GenericRepository {
  constructor(commentModel) {
    super(commentModel || Comment);
  }
}

module.exports.CommentReposotory = CommentReposotory;
module.exports.instance = new CommentReposotory();
