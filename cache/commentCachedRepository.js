const key = require('../redis/key');
const GenericRepository = require('./genericCachedRepository');

class CommentCachedRepository extends GenericRepository {
  create(comment) {
    const { redisClient, repository } = this;
    let commented = null;

    return repository.create(comment).then((result) => {
      commented = result;
      if (commented.postId) {
        return redisClient.hincrby(key.postOfposts(commented.postId), 'comments', 1);
      }
      return Promise.resolve();
    }).then(() => commented);
  }
}

module.exports.CommentCachedRepository = CommentCachedRepository;
