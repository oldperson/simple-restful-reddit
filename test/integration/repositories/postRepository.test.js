/* eslint-disable arrow-body-style */
const { expect } = require('chai');
const {
  sequelize, Community, Post, Vote,
} = require('../../../orm/models');
const { PostRepository } = require('../../../repositories/postRepository');
const { IdentityNotFoundError, EntityNotFoundError } = require('../../../repositories/errors');

const postRepository = new PostRepository(Post);

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
    createdAt: '2019-4-7',
    updatedAt: '2019-4-7',
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


const insertUserSql = `INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('1', 'testuser1', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('2', 'testuser2', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('3', 'testuser3', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('4', 'testuser4', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('5', 'testuser5', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('6', 'testuser6', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('7', 'testuser7', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('8', 'testuser8', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('9', 'testuser9', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');
INSERT INTO User (userId, userName, email, passwordHash, createdAt, updatedAt)
VALUES ('10', 'testuser10', 'test@gmail.com', 'pasword', '2019-8-17', '2019-8-17');`;

/**
 * { postId: 1, ups: 10, down: 0, createdAt: 2019-3-29 }
 * { postId: 2, ups: 9, down: 0, createdAt: 2019-4-7 }
 * { postId: 3, ups: 5, down: 5, createdAt: 2019-4-1 }
 */
const insertVotesSql = `INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 1, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 2, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 3, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 4, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 5, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 6, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 7, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 8, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 9, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (1, 10, 1, '2019-8-11', '2019-8-11');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 1, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 2, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 3, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 4, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 5, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 6, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 7, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 8, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (2, 9, 1, '2019-8-12', '2019-8-12');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 1, 1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 2, 1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 3, 1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 4, 1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 5, 1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 6, -1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 7, -1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 8, -1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 9, -1, '2019-8-13', '2019-8-13');
INSERT INTO Vote (postId, userId, value, createdAt, updatedAt)
VALUES (3, 10, -1, '2019-8-13', '2019-8-13');`;

// TODO: resolve table lock, when all repository tests run simultaneously.
describe('postRepository', () => {
  before('Set up user and community data',
    () => sequelize.sync({ force: true })
      .then(() => sequelize.query(insertUserSql))
      .then(() => Community.create(defaultCommunity)));

  describe('creaeteUnder', () => {
    afterEach(() => postRepository.sequelizeModel.truncateIgnoreFK());
    it('should work when community and post data are provided', () => {
      const post = {
        title: 'new post',
        content: 'hello',
        authorId: 1,
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
        authorId: 1,
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
      .then(() => sequelize.query(insertVotesSql)));
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

    it('should sort by top', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'top' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId).to.equal(1);
        });
    });

    it('should sort by hot', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'hot' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId).to.equal(2);
        });
    });

    it('should sort by controversial', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'controversial' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId).to.equal(3);
        });
    });

    it('should sort by new', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'new' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId).to.equal(2); // 2019-4-7
          expect(posts[1].postId).to.equal(3); // 2019-4-1
          expect(posts[2].postId).to.equal(1); // 2019-3-29
        });
    });

    it('should find posts when communityName is null', () => {
      return postRepository.findUnder(null)
        .then((posts) => {
          expect(posts).to.lengthOf(3);
        });
    });
  });

  describe('findById', () => {
    it('should return Promise<Model> when the id is found', () => {
      return postRepository.findById(2)
        .then((post) => {
          expect(post).to.be.exist;
          expect(post.postId).to.equal(2);
        });
    });

    it('should return Promise<EntityNotFoundError> when the id is not found', () => {
      return postRepository.findById(99)
        .then(() => expect.fail())
        .catch(error => expect(error).to.be.instanceof(EntityNotFoundError));
    });
  });

  describe('update', () => {
    it('should have error message tell the user that the post is not his/hers', () => {
      return postRepository.update({ content: 'should not uupdate' }, { postId: 1, authorId: 99 })
        .then(() => expect.fail())
        .catch((error) => {
          expect(error).to.be.instanceof(EntityNotFoundError);
          expect(error.message).to.equal('the author does not have this post');
        });
    });
  });
});
