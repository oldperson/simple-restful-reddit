const { updatePostRanking } = require('../redis/helper');
const key = require('../redis/key');

class VoteCachedRepository {
  /**
   *
   * @param {*} redisClient
   * @param {*} voteRepository
   */
  constructor(redisClient, voteRepository) {
    this.redisClient = redisClient;
    this.voteRepository = voteRepository;
  }

  createOrUpdate(vote) {
    const { redisClient } = this;
    const upVotekey = key.upvotesOfPost(vote.postId);
    const downVotekey = key.downvotesOfPost(vote.postId);
    let voted = null;
    let communityName = null;
    let postCreatedAt = null;

    this.voteRepository.createOrUpdate(vote)
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
        return redisClient.watch(upVotekey, downVotekey);
      })
      .then(() => redisClient.batch()
        .scard(upVotekey)
        .scard(downVotekey)
        .exec())
      .then((upsAndDowns) => {
        const batch = redisClient.batch();
        updatePostRanking(batch, vote.postId, communityName, ...upsAndDowns, postCreatedAt);
        return batch.exec();
      })
      .then(() => voted);
  }
}

module.exports.VoteCachedRepository = VoteCachedRepository;
