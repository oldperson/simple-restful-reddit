const { expect } = require('chai');
const { sequelize, User, Community } = require('../../../orm/models');
const postRepository = require('../../../repositories/postRepository').instance;

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
        });
    });
  });
});
