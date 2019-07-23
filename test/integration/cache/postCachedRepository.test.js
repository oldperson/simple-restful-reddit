const { expect } = require('chai');
const sinon = require('sinon');

const redisClient = require('../../../redis/index');
const { PostCachedRepository } = require('../../../cache/postCachedRepository');
const key = require('../../../redis/key');
const { updatePostRanking } = require('../../../redis/helper');

const postRepository = {
  createUnder: sinon.stub().resolvesArg(1),
  update: sinon.stub().resolves([{
    postId: 1,
    title: 'test',
    content: 'updated',
    communityName: 'tsetCom',
    authorId: 1,
    createdAt: new Date(2019, 7, 19),
    updatedAt: new Date(2019, 7, 19),
  }]),
  findById: sinon.spy(),
};

const postCachedRepository = new PostCachedRepository(redisClient, postRepository);
const newPost = {
  postId: 1,
  title: 'test',
  content: 'test',
  communityName: 'tsetCom',
  authorId: 1,
  createdAt: new Date(2019, 7, 19),
  updatedAt: new Date(2019, 7, 19),
};

describe('PostCachedRepository', () => {
  before('flush redic cache', () => redisClient.flushall());

  describe('createUnder', () => {
    it('should return new post', () => postCachedRepository.createUnder('testCom', newPost).then((post) => {
      expect(post).to.be.exist;
    }));
  });

  describe('update', () => {
    it('should return updated post', () => postCachedRepository.update({ content: 'updated' }, { postId: 1, authorId: 1 })
      .then((result) => {
        expect(result).to.length(1);
        expect(result[0]).to.exist;
      }));
  });

  describe('findById', () => {
    before(() => redisClient.hmset(key.postOfposts(newPost.postId), newPost));

    it('should find post in cache', () => postCachedRepository.findById(newPost.postId)
      .then((result) => {
        expect(result).to.be.exist;
        expect(postRepository.findById.notCalled).to.be.true;
      }));
  });

  describe('findUnder', () => {
    const posts = [
      {
        postId: 1,
        title: 'the most controversial',
        content: 'test',
        communityName: 'CommA',
        authorId: 1,
        ups: 1000,
        downs: 1000,
        createdAt: new Date(2019, 7, 19),
        updatedAt: new Date(2019, 7, 19),
      },
      {
        postId: 2,
        title: 'the top and hottest',
        content: 'test',
        communityName: 'CommA',
        authorId: 1,
        ups: 1000,
        downs: 0,
        createdAt: new Date(2019, 7, 19),
        updatedAt: new Date(2019, 7, 19),
      },
      {
        postId: 3,
        title: 'the newest',
        content: 'test',
        communityName: 'CommA',
        authorId: 1,
        ups: 0,
        downs: 0,
        createdAt: new Date(2019, 7, 20),
        updatedAt: new Date(2019, 7, 20),
      },
      {
        postId: 4,
        title: 'the post of CommB',
        content: 'test',
        communityName: 'CommB',
        authorId: 1,
        ups: 0,
        downs: 0,
        createdAt: new Date(2019, 7, 19),
        updatedAt: new Date(2019, 7, 19),
      },
    ];

    before(() => {
      const batch = redisClient.batch();
      posts.forEach((post) => {
        batch.hmset(key.postOfposts(post.postId), post);

        for (let i = 1; i <= post.ups; i += 1) {
          batch.sadd(key.upvotesOfPost(post.postId), i);
        }

        for (let i = 1; i <= post.downs; i += 1) {
          batch.sadd(key.downvotesOfPost(post.postId), i);
        }

        updatePostRanking(batch,
          post.postId,
          post.communityName,
          post.ups, post.downs,
          post.createdAt);
      });

      return batch.exec();
    });

    it('should find posts  when posts is null', () => postCachedRepository.findUnder(null)
      .then((results) => {
        expect(results).to.length(4);
      }));

    it('should find posts of given community', () => postCachedRepository.findUnder('CommB').then((results) => {
      expect(results).to.length(1);
      expect(results[0].communityName).to.equal('CommB');
    }));

    it('should sorted by hot', () => postCachedRepository.findUnder(null, { sort: 'hot' })
      .then((results) => {
        expect(results).to.length(4);
        expect(results[0].title).to.equal('the top and hottest');
      }));

    it('should sorted by new', () => postCachedRepository.findUnder(null, { sort: 'new' })
      .then((results) => {
        expect(results).to.length(4);
        expect(results[0].title).to.equal('the newest');
      }));

    it('should sorted by top', () => postCachedRepository.findUnder(null, { sort: 'top' })
      .then((results) => {
        expect(results).to.length(4);
        expect(results[0].title).to.equal('the top and hottest');
      }));

    it('should sorted by controversial', () => postCachedRepository.findUnder(null, { sort: 'controversial' })
      .then((results) => {
        expect(results).to.length(4);
        expect(results[0].title).to.equal('the most controversial');
      }));
  });

  afterEach('sinon restore', () => sinon.restore());
});
