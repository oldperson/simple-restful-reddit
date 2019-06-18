const { expect } = require('chai');
const {
  mongoose, User, Community, Post, Comment,
} = require('../../../odm/models');
const { CommentRepository } = require('../../../mongo-repositories/commentRepository');

const commentRepository = new CommentRepository(Comment);

const defaultUser = {
  userId: mongoose.Types.ObjectId('5ced06ecb21e2bc562f8ad10'),
  userName: 'test',
  passwordHash: 'passwordHash',
  email: 'test@gmail.com',
};
const defaultCommunity = {
  communityId: mongoose.Types.ObjectId('5ced070947288e3917097bf4'),
  communityName: 'testCom',
};
const defaultPost = {
  postId: mongoose.Types.ObjectId('5ced071bc05557207f984843'),
  communityId: defaultCommunity.communityId,
  communityName: 'testCom',
  authorId: defaultUser.userId,
  title: 'testPost',
  content: 'hello',
};
const defaultComment = {
  commentId: mongoose.Types.ObjectId('5ced0767c036491f37d93760'),
  postId: defaultPost.postId,
  authorId: defaultUser.userId,
  content: 'expected comment',
};
const defaultReply = {
  parentCommentId: defaultComment.commentId,
  authorId: defaultUser.userId,
  content: 'expected reply',
};

describe('commentRepository', () => {
  before(() => mongoose.connection.dropDatabase()
    .then(() => User.create(defaultUser))
    .then(() => Community.create(defaultCommunity))
    .then(() => Post.create(defaultPost)));

  describe('create', () => {
    afterEach('truncate comment', () => mongoose.connection.dropCollection(Comment.collection.collectionName));
    it('should work when create a comment', () => commentRepository.create(defaultComment)
      .then((result) => {
        expect(result.postId.equals(defaultComment.postId)).to.be.true;
        expect(result.authorId.equals(defaultComment.authorId)).to.be.true;
        expect(result.content).to.equal(defaultComment.content);
      }));
    it('should work when create a reply', () => Comment.create(defaultComment)
      .then(() => commentRepository.create(defaultReply))
      .then((result) => {
        expect(result.parentCommentId.equals(defaultReply.parentCommentId)).to.be.true;
        expect(result.authorId.equals(defaultReply.authorId)).to.be.true;
        expect(result.content).to.equal(defaultReply.content);
      }));
  });

  describe('findAll', () => {
    before('set up comment and reply', () => Comment.create(defaultComment)
      .then(() => Comment.create(defaultReply)));
    after('truncate comment', () => mongoose.connection.dropCollection(Comment.collection.collectionName));
    it('should return comments when give postId', () => {
      const where = {
        postId: defaultComment.postId,
      };
      return commentRepository.findAll(where)
        .then((comments) => {
          expect(comments).to.be.an('array');
          expect(comments).to.have.lengthOf(1);
          expect(comments[0].postId.equals(defaultComment.postId)).to.be.true;
          expect(comments[0].authorId.equals(defaultComment.authorId)).to.be.true;
          expect(comments[0].content).to.equal(defaultComment.content);
        });
    });

    it('should return replies when give parentCommentId', () => {
      const where = {
        parentCommentId: defaultComment.commentId,
      };
      return commentRepository.findAll(where)
        .then((comments) => {
          expect(comments).to.be.an('array');
          expect(comments).to.have.lengthOf(1);
          expect(comments[0].parentCommentId.equals(defaultReply.parentCommentId)).to.be.true;
          expect(comments[0].authorId.equals(defaultReply.authorId)).to.be.true;
          expect(comments[0].content).to.equal(defaultReply.content);
        });
    });
  });
});
