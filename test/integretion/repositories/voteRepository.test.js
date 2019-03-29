const { expect } = require('chai');
const {
  sequelize, User, Community, Post, Vote,
} = require('../../../orm/models');
const voteRepository = require('../../../repositories/voteRepository').instance;

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
const defaultVote = {
  postId: 1,
  userId: 1,
  value: 1,
};

describe('VoteRepository', () => {
  before(() => sequelize.sync({ force: true })
    .then(() => User.create(defaultUser))
    .then(() => Community.create(defaultCommunity))
    .then(() => Post.create(defaultPost)));

  describe('CreateOrUpdate', () => {
    afterEach(() => Vote.truncate());
    it('should create new vote', () => voteRepository.createOrUpdate(defaultVote)
      .then((success) => {
        if (sequelize.getDialect() === 'sqlite') {
          expect(success).to.be.undefined;
        } else {
          expect(success).to.be.true;
        }
      }));

    it('should update vote', () => {
      const updated = Object.assign({}, defaultVote);
      updated.value = -1;
      return Vote.create(defaultVote)
        .then(() => voteRepository.createOrUpdate(updated))
        .then((success) => {
          if (sequelize.getDialect() === 'sqlite') {
            expect(success).to.be.undefined;
          } else {
            expect(success).to.be.true;
          }
        });
    });
  });
});
