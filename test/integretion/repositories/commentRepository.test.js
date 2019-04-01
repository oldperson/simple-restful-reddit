const { expect } = require('chai');
const {
  sequelize, User, Community, Post, Comment,
} = require('../../../orm/models');
const commentRepository = require('../../../repositories/commentRepository').instance;

const defaultUser = {
  userId: 1,
  userName: 'test',
  passwordHash: 'passwordHash',
  email: 'test@gmail.com',
};
const defaultCommunity = {
  communityId: 1,
  communityName: 'testCom',
};
const defaultPost = {
  postId: 1,
  communityId: 1,
  authorId: 1,
  title: 'testPost',
  content: 'hello',
};
const defaultComment = {
  commentId: 1,
  postId: 1,
  authorId: 1,
  content: 'expected comment',
};
const defaultReply = {
  parentCommentId: 1,
  authorId: 1,
  content: 'expected reply',
};

describe('commentRepository', () => {
  before(() => sequelize.sync({ force: true })
    .then(() => User.create(defaultUser))
    .then(() => Community.create(defaultCommunity))
    .then(() => Post.create(defaultPost)));

  describe('create', () => {
    afterEach('truncate comment', () => Comment.truncate());
    it('should work when create a comment', () => commentRepository.create(defaultComment)
      .then((result) => {
        expect(result).to.include(defaultComment);
      }));
    it('should work when create a reply', () => Comment.create(defaultComment)
      .then(() => commentRepository.create(defaultReply))
      .then((result) => {
        expect(result).to.include(defaultReply);
      }));
  });

  describe('findAll', () => {
    before('set up comment and reply', () => Comment.create(defaultComment)
      .then(() => Comment.create(defaultReply)));
    after('truncate comment', () => Comment.truncate());
    it('should return comments when give postId', () => {
      const where = {
        postId: 1,
        parentCommentId: null,
      };
      return commentRepository.findAll(where)
        .then((comments) => {
          expect(comments).to.be.an('array');
          expect(comments).to.have.lengthOf(1);
          expect(comments[0]).to.deep.include(defaultComment);
        });
    });

    it('should return replies when give commentId', () => {
      const where = {
        parentCommentId: 1,
      };
      return commentRepository.findAll(where)
        .then((comments) => {
          expect(comments).to.be.an('array');
          expect(comments).to.have.lengthOf(1);
          expect(comments[0]).to.deep.include(defaultReply);
        });
    });
  });

  describe('', () => {
    before('set up comment and reply', () => Comment.create(defaultComment)
      .then(() => Comment.create(defaultReply)));
    after('truncate comment', () => Comment.truncate());

    it('', () => {
      const where = {
        postId: 1,
        parentCommentId: null,
      };
      return commentRepository.findAll(where)
        .then((comments) => {
          expect(comments).to.be.an('array');
          expect(comments).to.have.lengthOf(1);
          expect(comments[0]).to.include(defaultComment);
        });
    });

    it('should return replies when give commentId', () => {
      const where = {
        parentCommentId: 1,
      };
      return commentRepository.findAll(where)
        .then((comments) => {
          expect(comments).to.be.an('array');
          expect(comments).to.have.lengthOf(1);
          expect(comments[0]).to.include(defaultReply);
        });
    });
  });
});
