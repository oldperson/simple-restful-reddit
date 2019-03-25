const { expect } = require('chai');
const {
  sequelize, User, Community, Post,
} = require('../../../orm/models');
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
const defaultPosts = [
  {
    title: 'test1',
    content: 'test1 ccontent',
    authorId: 1,
    communityId: 1,
  },
  {
    title: 'test2',
    content: 'test2 ccontent',
    authorId: 1,
    communityId: 1,
  },
  {
    title: 'test3',
    content: 'test3 ccontent',
    authorId: 1,
    communityId: 1,
  },
];
// TODO: resolve table lock, when all repository tests run simultaneously.
describe('postRepository', () => {
  before('Set up user and community data',
    () => sequelize.sync({ force: true })
      .then(() => User.create(defaultUser))
      .then(() => Community.create(defaultCommunity)));

  describe('creaeteUnder', () => {
    afterEach(() => postRepository.sequelizeModel.truncate({ truncate: true }));
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

  describe('findUnder', () => {
    before(() => Post.bulkCreate(defaultPosts));
    it('should use default options when options are undifined', () => postRepository.findUnder(defaultCommunity.communityName)
      .then((results) => {
        expect(results).to.exist;
        expect(results.length).equal(3);
      }));

    it('should filter out title when options.search is defined', () => {
      postRepository.findUnder(defaultCommunity.communityName, { search: defaultPosts[0].title })
        .then((results) => {
          expect(results).to.exist;
          expect(results[0].title).to.equal(defaultPosts[0].title);
        });

      it('should return limited number of posts when options.limit is defined', () => {
        postRepository.findUnder(defaultCommunity.communityName, { limit: 1 })
          .then((results) => {
            expect(results).to.exist;
            expect(results.length).equal(1);
          });
      });

      it('should offset rows when options.offset is defined', () => {
        postRepository.findUnder(defaultCommunity.communityName, { offset: 1 })
          .then((results) => {
            expect(results).to.exist();
            expect(results.length).to.equal(2);
          });
      });
    });
  });
});
