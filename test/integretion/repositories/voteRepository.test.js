const { expect } = require('chai');
const {
  sequelize, User, Community, Post, Vote,
} = require('../../../orm/models');
const { VoteRepository } = require('../../../repositories/voteRepository');
const { IdentityNotFoundError } = require('../../../repositories/errors');

const voteRepository = new VoteRepository(Vote);

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

    it('should return Promise<IdentityNotFoundError> when user not exist', () => {
      const newVote = Object.assign({}, defaultVote);
      newVote.userId = -1;
      return voteRepository.createOrUpdate(newVote)
        .then(() => expect.fail('should throw'))
        .catch((error) => {
          expect(error).instanceOf(IdentityNotFoundError);
        });
    });

    it('should return Promise<IdentityNotFoundError> when post not exist', () => {
      const newVote = Object.assign({}, defaultVote);
      newVote.postId = -1;
      return voteRepository.createOrUpdate(newVote)
        .then(() => expect.fail('should throw'))
        .catch((error) => {
          expect(error).instanceOf(IdentityNotFoundError);
        });
    });
  });
});
