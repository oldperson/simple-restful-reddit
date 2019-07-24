const { expect } = require('chai');
const sinon = require('sinon');

const redisClient = require('../../../redis');
const key = require('../../../redis/key');
const { VoteCachedRepository } = require('../../../cache/voteCachedRepository');

function createOrUpdateAsnc(vote) {
  return new Promise((resolve, reject) => {
    setImmediate((err) => {
      if (err) {
        reject(err);
      }
      resolve(vote);
    });
  });
}

const voteRepository = {
  createOrUpdate: sinon.spy(createOrUpdateAsnc),
};

const voteCachedRepository = new VoteCachedRepository(redisClient, voteRepository);

const post = {
  postId: 1,
  communityName: 'testComm',
  createdAt: new Date(2019, 10, 10),
  updatedAt: new Date(2019, 10, 10),
};

const upvote = {
  postId: 1,
  userId: 1,
  value: 1,
  createdAt: new Date(2019, 10, 10),
  updatedAt: new Date(2019, 10, 10),
};

const downvote = {
  postId: 1,
  userId: 1,
  value: 1,
  createdAt: new Date(2019, 10, 10),
  updatedAt: new Date(2019, 10, 10),
};

describe('VoteCachedRepository', () => {
  before('flush redic cache', () => redisClient.flushall()
    .then(() => redisClient.hmset(key.postOfposts(1), post)));
  afterEach('sinon restore', () => sinon.restore());

  describe('createOrUpdate', () => {
    it('should update ranking when voting up', () => voteCachedRepository.createOrUpdate(upvote)
      .then((result) => {
        expect(result).to.exist;
      }));

    it('should update ranking when voting down', () => voteCachedRepository.createOrUpdate(downvote)
      .then((result) => {
        expect(result).to.exist;
      }));
  });
});
