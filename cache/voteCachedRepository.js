const GenericCachedRepository = require('./genericCachedRepository');
const { updatePostRanking } = require('../redis/helper');
const key = require('../redis/key');

class VoteCachedRepository extends GenericCachedRepository {
  createOrUpdate(vote) {
    const { redisClient } = this;
    const upVotekey = key.upvotesOfPost(vote.postId);
    const downVotekey = key.downvotesOfPost(vote.postId);
    let voted = null;
    let communityName = null;
    let postCreatedAt = null;

    return this.repository.createOrUpdate(vote)
      .then((result) => {
        voted = result;
        const batch = redisClient.batch();
        batch.hget(key.postOfposts(vote.postId), 'communityName');
        batch.hget(key.postOfposts(vote.postId), 'createdAt');
        batch.srem(upVotekey, voted.userId);
        batch.srem(downVotekey, voted.userId);

        if (voted.value === 1 || voted.value === -1) {
          batch.sadd(voted.value === 1 ? upVotekey : downVotekey, voted.userId);
        }
        return batch.exec();
      })
      .then((results) => {
        [communityName, postCreatedAt] = results;
        postCreatedAt = new Date(postCreatedAt);
        return redisClient.watch(upVotekey, downVotekey);
      })
      .then(() => {
        const batch = redisClient.batch();
        batch.scard(upVotekey);
        batch.scard(downVotekey);
        return batch.exec();
      })
      .then((upsAndDowns) => {
        const batch = redisClient.batch();
        updatePostRanking(batch, vote.postId, communityName, ...upsAndDowns, postCreatedAt);
        return batch.exec();
      })
      .then(() => voted);
  }
}

module.exports.VoteCachedRepository = VoteCachedRepository;
