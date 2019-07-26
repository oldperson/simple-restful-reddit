const { expect } = require('chai');
const sinon = require('sinon');

const redisClient = require('../../../redis');
const key = require('../../../redis/key');
const { CommentCachedRepository } = require('../../../cache/commentCachedRepository');

const repository = {
  create: sinon.stub().resolvesArg(0),
};

const commentCachedRepository = new CommentCachedRepository(redisClient, repository);

const defaultComment = {
  commentId: 1,
  postId: 1,
  authorId: 1,
  parentCommentId: null,
  content: 'this is a new comment',
  replies: 0,
  createdAt: new Date(2019, 10, 11),
  updatedAt: new Date(2019, 10, 11),
};

const defaultReply = {
  commentId: 1,
  postId: null,
  authorId: 1,
  parentCommentId: 22,
  content: 'this is a new reply',
  replies: 0,
  createdAt: new Date(2019, 10, 11),
  updatedAt: new Date(2019, 10, 11),
};


describe('Comment', () => {
  before(() => redisClient.hmset(key.postOfposts(1), {
    postId: 1,
    comments: 0,
  }));

  beforeEach(() => sinon.spy(redisClient, 'hincrby'));

  afterEach(() => sinon.restore());

  after(() => redisClient.flushall());

  describe('create', () => {
    it('should increase the comments of post when comment', () => commentCachedRepository.create(defaultComment).then((result) => {
      expect(result).to.exist;
      expect(redisClient.hincrby.called).to.be.true;
    }));

    it('should not increate the commenst of post when reply', () => commentCachedRepository.create(defaultReply).then((result) => {
      expect(result).to.exist;
      expect(redisClient.hincrby.called).to.be.false;
    }));
  });
});
