const GenericCachedRepository = require('./genericCachedRepository');
const { updatePostRanking } = require('../redis/helper');
const key = require('../redis/key');

/**
 * Fetch cached posts
 * @private
 * @param {*} redisClient
 * @param  {...any} postIds
 * @returns {Promise<Array<object>}
 */
function fetchCachedPosts(redisClient, ...postIds) {
  const batch = redisClient.batch();
  let upAndDowns = null;

  // fetch upvotes and downvotes of post
  postIds.forEach((postId) => {
    batch.scard(key.upvotesOfPost(postId));
    batch.scard(key.downvotesOfPost(postId));
  });

  return batch.exec().then((result) => {
    const innerBatch = redisClient.batch();
    upAndDowns = result;

    // fetch posts
    postIds.forEach((postId) => {
      innerBatch.hgetall(key.postOfposts(postId));
    });

    return innerBatch.exec();
  }).then((result) => {
    for (let i = 0; i < result.length; i += 1) {
      if (result[i]) {
        // eslint-disable-next-line no-param-reassign
        result[i].ups = upAndDowns[2 * i];
        // eslint-disable-next-line no-param-reassign
        result[i].downs = upAndDowns[2 * i + 1];
      }
    }

    return result;
  });
}

/**
 * @class Construct a post repository
 * @param {Object} postModel Set up model to access resources.
 */
class PostCachedRepository extends GenericCachedRepository {
  /**
   * Create a post under in given community.
   * @param {string} communityName
   * @param {object} post
   * @returns {Promise<object>} { postId }
   */
  createUnder(communityName, post) {
    const { redisClient } = this;
    let posted = null;

    return this.repository.createUnder(communityName, post)
      .then((result) => {
        posted = result;
        posted.comments = 0;
        posted.ups = 0;
        posted.downs = 0;

        const batch = redisClient.batch();
        // batch.sadd(key.postsOfCommunity(communityName), posted.postId);
        batch.hmset(key.postOfposts(posted.postId), posted);
        batch.hmset(key.postOfposts(posted.postId), 'comments', 0);
        updatePostRanking(batch, posted.postId, posted.communityName, posted.ups, posted.downs,
          posted.createdAt);
        return batch.exec();
      })
      .then(() => posted);
  }

  /**
   * @param {string} communityName Find the posts of the community, if communityName is null,
   *  find posts without considering the community.
   * @param {object} [options={}]
   * @param {number} [options.offset=0]
   * @param {number} [options.limit=20]
   * @param {string} [options.sort=new]
   * @param {string} [options.search]
   */
  findUnder(communityName, options = {}) {
    // TODO: implement search base on inverted index
    if (options.search) {
      return this.repository.findUnder(communityName, options);
    }

    const { redisClient, repository } = this;
    const opt = Object.assign({
      offset: 0,
      limit: 20,
      sort: 'new',
    }, options);

    const start = opt.offset;
    const stop = opt.offset + opt.limit;
    const postsKey = communityName === null
      ? key.postsSortBy(opt.sort)
      : key.postsOfCommunitySortBy(communityName, opt.sort);

    return redisClient.zrevrange(postsKey, start, stop)
      .then(postIds => fetchCachedPosts(redisClient, ...postIds))
      .then((result) => {
        // cache miss
        if (!result || result.length === 0) {
          return repository.findUnder(communityName, options);
        }

        return result;
      });
  }

  findById(postId) {
    const { redisClient, repository } = this;
    let post = null;

    return fetchCachedPosts(redisClient, postId)
      .then((cached) => {
        if (cached[0]) {
          return Promise.resolve(cached[0]);
        }
        return repository.findById(postId);
      })
      .then((unCached) => {
        post = unCached;
        return redisClient.hmset(key.postOfposts(postId), unCached);
      })
      .then(() => Promise.resolve(post));
  }

  /**
  * Update properties of models.
  * @param {object} changes Valuse would be changed.
  * @param {*} where Values for find the models should be changed.
  * @returns {Promise<Array<object>} Array of updated model.
  */
  update(changes, where) {
    const { redisClient, repository } = this;
    let posts = null;

    return repository.update(changes, where)
      .then((updated) => {
        posts = updated;
        const batch = redisClient.batch();
        posts.forEach(post => batch.hmset(key.postOfposts(post.postId), post));
        return batch.exec();
      })
      .then(() => {
        const postIds = posts.map((post => post.postId));

        return fetchCachedPosts(redisClient, ...postIds);
      });
  }
}

module.exports.PostCachedRepository = PostCachedRepository;
