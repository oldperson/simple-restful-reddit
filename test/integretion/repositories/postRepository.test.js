/* eslint-disable arrow-body-style */
const { expect } = require('chai');
const {
  sequelize, User, Community, Post, Vote,
} = require('../../../orm/models');
const { PostRepository } = require('../../../repositories/postRepository');
const { IdentityNotFoundError } = require('../../../repositories/errors');

const postRepository = new PostRepository(Post);

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
    postId: 1,
    title: 'test1',
    content: 'test1 ccontent',
    authorId: 1,
    communityId: 1,
    createdAt: '2019-3-29',
    updatedAt: '2019-3-29',
  },
  {
    postId: 2,
    title: 'test2',
    content: 'test2 ccontent',
    authorId: 1,
    communityId: 1,
    createdAt: '2019-3-30',
    updatedAt: '2019-3-30',
  },
  {
    postId: 3,
    title: 'test3',
    content: 'test3 ccontent',
    authorId: 1,
    communityId: 1,
    createdAt: '2019-4-1',
    updatedAt: '2019-4-1',
  },
];
const defaultVote = {
  postId: 2,
  userId: 1,
  value: 1,
};

// TODO: resolve table lock, when all repository tests run simultaneously.
describe('postRepository', () => {
  before('Set up user and community data',
    () => sequelize.sync({ force: true })
      .then(() => User.create(defaultUser))
      .then(() => Community.create(defaultCommunity)));

  describe('creaeteUnder', () => {
    afterEach(() => postRepository.sequelizeModel.truncateIgnoreFK());
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
    before(() => Post.bulkCreate(defaultPosts)
      .then(() => Vote.upsert(defaultVote)));
    after(() => Vote.truncateIgnoreFK());
    it('should use default options when options are undifined', () => postRepository.findUnder(defaultCommunity.communityName)
      .then((results) => {
        expect(results).to.exist;
        expect(results.length).equal(3);
      }));

    it('should filter out title when options.search is defined', () => {
      return postRepository
        .findUnder(defaultCommunity.communityName, { search: defaultPosts[0].title })
        .then((results) => {
          expect(results).to.exist;
          expect(results[0].title).to.equal(defaultPosts[0].title);
        });
    });

    it('should return limited number of posts when options.limit is defined', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { limit: 1 })
        .then((results) => {
          expect(results).to.exist;
          expect(results.length).equal(1);
        });
    });

    it('should offset rows when options.offset is defined', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { offset: 1 })
        .then((results) => {
          expect(results).to.exist;
          expect(results.length).to.equal(2);
        });
    });

    it('should sort by votes when options.sort is best', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'best' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId).to.equal(2);
        });
    });

    it('should sort by votes when options.sort is hot', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'hot' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId).to.equal(3);
          expect(posts[1].postId).to.equal(2);
          expect(posts[2].postId).to.equal(1);
        });
    });

    it('should sort by votes when options.sort is new', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'hot' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId).to.equal(3);
          expect(posts[1].postId).to.equal(2);
          expect(posts[2].postId).to.equal(1);
        });
    });
  });
});
