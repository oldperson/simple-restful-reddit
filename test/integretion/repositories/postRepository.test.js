const { expect } = require('chai');
const { sequelize, User, Community } = require('../../../orm/models');
const postRepository = require('../../../repositories/postRepository').instance;
const { IdentityNotFoundError } = require('../../../repositories/errors');

const defaultUser = {
  userId: 1,
  userName: 'test',
  passwordHash: 'aaaaaa',
  email: 'ggg@gmail.com',
};
const defaultCommunity = {
  communityId: 1,
  communityName: 'comForTest',
};
// TODO: resolve table lock, when all repository tests run simultaneously.
describe('postRepository', () => {
  before('Set up user and community data',
    () => sequelize.sync({ force: true })
      .then(() => User.create(defaultUser))
      .then(() => Community.create(defaultCommunity)));
  afterEach(() => postRepository.sequelizeModel.truncate({ truncate: true }));

  describe('creaeteUnder', () => {
    it('should work when community and post data are provided', () => {
      const post = {
        title: 'new post',
        content: 'hello',
        authorId: defaultUser.userId,
      };
      return postRepository.createUnder(defaultCommunity.communityName, post)
        .then((result) => {
          expect(result.postId).to.exist;
          expect(result).includes(post);
        });
    });

    it('should return Promise<IdentiryNotFoundError> when community not exists', () => {
      const post = {
        title: 'new post',
        content: 'hello',
        authorId: defaultUser.userId,
      };
      return postRepository.createUnder('notExistsCom', post)
        .catch((error) => {
          expect(error).to.be.instanceof(IdentityNotFoundError);
        });
    });

    it('should return Promise<IdentiryNotFoundError> when autorId not exists', () => {
      const post = {
        title: 'new post',
        content: 'hello',
        authorId: 99,
      };
      return postRepository.createUnder(defaultCommunity.communityName, post)
        .catch((error) => {
          expect(error).to.be.instanceof(IdentityNotFoundError);
        });
    });
  });
});
