const GenericRepository = require('./genericRepository');
const { IdentityNotFoundError } = require('../repositories/errors');

const sortToOption = Object.freeze({
  new: { updatedAt: -1 },
  best: { votes: -1 },
  hot: {
    updatedAt: -1,
    votes: -1,
  },
});

/**
 * @class Construct a post repository
 * @param {Object} postModel Set up model to access resources.
 */
class PostRepository extends GenericRepository {
  /**
   * Create a post under in given community.
   * @param {string} communityName
   * @param {object} post
   * @returns {Promise<object>} { postId }
   */
  createUnder(communityName, post) {
    const Post = this.mongooseModel;
    const { db } = this.mongooseModel;

    return db.collection('communities')
      .findOne({ communityName }, { projection: { _id: 1 } })
      .then((comm) => {
        if (!comm) {
          return Promise.reject(new IdentityNotFoundError({ community: communityName }));
        }
        // eslint-disable-next-line no-underscore-dangle
        return Post.create(Object.assign({ }, post, { communityId: comm._id, communityName }));
      });
  }

  /**
   * @param {string} communityName Find the posts of the community, if communityName is null,
   *  find posts without considering the community.
   * @param {object} [options={}]
   * @param {number} [options.offset=0]
   * @param {number} [options.limit=20]
   * @param {string} [options.sort=new]
   * @param {string} [options.search]
   * @returns {Promise}
   */
  findUnder(communityName, options = {}) {
    const conditions = getMongooseQueryConditions(options);
    const projection = null;
    const queryOptions = getMongooseQueryOptions(options);
    
    if (communityName != null) { 
      conditions.communityName = communityName;
    }

    return this.mongooseModel.find(conditions, projection, queryOptions).exec();
  }
}

function getMongooseQueryConditions(options) {
  const conditions = {};

  if (options.search) {
    conditions.title = new RegExp(options.search);
  }

  return conditions;
}

function getMongooseQueryOptions(options) {
  const queryOptions = {
    skip: 0,
    limit: 20,
    sort: { updatedAt: -1 },
  };
  
  if (options.offset) {
    queryOptions.skip = options.offset;
  }

  if (options.limit) {
    queryOptions.limit = options.limit;
  }

  if (options.sort) {
    queryOptions.sort = sortToOption[options.sort];
  }

  return queryOptions;
}

module.exports.PostRepository = PostRepository;
