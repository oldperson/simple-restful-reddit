const { expect } = require('chai');
const {
  mongoose, User, Community, Post, Vote,
} = require('../../../odm/models');
const { VoteRepository } = require('../../../mongo-repositories/voteRepository');
const { IdentityNotFoundError } = require('../../../mongo-repositories/errors');

const voteRepository = new VoteRepository(Vote);

const defaultUser = {
  userId: mongoose.Types.ObjectId('5ced57a1a1e7c3f202e516ef'),
  userName: 'test',
  passwordHash: 'passwordHash',
  email: 'test@gmail.com',
};
const defaultCommunity = {
  communityId: mongoose.Types.ObjectId('5ced57b587a83bcc9671d832'),
  communityName: 'testCom',
};
const defaultPost = {
  postId: mongoose.Types.ObjectId('5ced57c801dbcedc41ce97b0'),
  communityId: defaultCommunity.communityId,
  communityName: defaultCommunity.communityName,
  authorId: defaultUser.userId,
  title: 'testPost',
  content: 'hello',
};
const defaultVote = {
  postId: defaultPost.postId,
  userId: defaultUser.userId,
  value: 1,
};

describe('VoteRepository', () => {
  before(() => mongoose.connection.dropDatabase()
    .then(() => User.create(defaultUser))
    .then(() => Community.create(defaultCommunity))
    .then(() => Post.create(defaultPost)));

  describe('CreateOrUpdate', () => {
    afterEach(() => mongoose.connection.dropCollection(Vote.collection.collectionName));
    it('should create new vote', () => voteRepository.createOrUpdate(defaultVote)
      .then((result) => {
        expect(result).to.be.exist;
        expect(result.value).to.equal(defaultVote.value);
      }));

    it('should update vote', () => {
      const updated = Object.assign({}, defaultVote);
      updated.value = -1;
      return Vote.create(defaultVote)
        .then(() => voteRepository.createOrUpdate(updated))
        .then((result) => {
          expect(result).to.be.exist;
          expect(result.value).to.equal(updated.value);
        });
    });

    it.skip('should return Promise<IdentityNotFoundError> when user not exist', () => {
      const newVote = Object.assign({}, defaultVote);
      newVote.userId = -1;
      return voteRepository.createOrUpdate(newVote)
        .then(() => expect.fail('should throw'))
        .catch((error) => {
          expect(error).instanceOf(IdentityNotFoundError);
        });
    });

    it.skip('should return Promise<IdentityNotFoundError> when post not exist', () => {
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
