/* eslint-disable arrow-body-style */
const { expect } = require('chai');
const {
  mongoose, User, Community, Post, Vote,
} = require('../../../odm/models');
const { PostRepository } = require('../../../mongo-repositories/postRepository');
const { IdentityNotFoundError } = require('../../../repositories/errors');

const postRepository = new PostRepository(Post);

const defaultUser = {
  userId: mongoose.Types.ObjectId('5cece4612b92ae1d096f230a'),
  userName: 'test',
  passwordHash: 'aaaaaa',
  email: 'ggg@gmail.com',
};
const defaultCommunity = {
  communityId: mongoose.Types.ObjectId('5cece472bc2915eddcc4cacf'),
  communityName: 'comForTest',
};
const defaultPosts = [
  {
    postId: mongoose.Types.ObjectId('5cece47ba3aeba359c337486'),
    title: 'test1',
    content: 'test1 ccontent',
    authorId: defaultUser.userId,
    communityId: defaultCommunity.communityId,
    communityName: defaultCommunity.communityName,
    createdAt: '2019-3-29',
    updatedAt: '2019-3-29',
  },
  {
    postId: mongoose.Types.ObjectId('5cece49c2e5c3879a80c035f'),
    title: 'test2',
    content: 'test2 ccontent',
    votes: 100,
    authorId: defaultUser.userId,
    communityId: defaultCommunity.communityId,
    communityName: defaultCommunity.communityName,
    createdAt: '2019-3-30',
    updatedAt: '2019-3-30',
  },
  {
    postId: mongoose.Types.ObjectId('5cece4c0e8a1ef9ffe8c2fd0'),
    title: 'test3',
    content: 'test3 ccontent',
    authorId: defaultUser.userId,
    communityId: defaultCommunity.communityId,
    communityName: defaultCommunity.communityName,
    createdAt: '2019-4-1',
    updatedAt: '2019-4-1',
  },
];
const defaultVote = {
  postId: defaultPosts[1].postId,
  userId: defaultUser.userId,
  value: 1,
};

describe('postRepository', () => {
  before('Set up user and community data',
    () => mongoose.connection.dropDatabase()
      .then(() => User.create(defaultUser))
      .then(() => Community.create(defaultCommunity)));

  describe('creaeteUnder', () => {
    afterEach(() => mongoose.connection.dropCollection(Post.collection.collectionName)
      .catch((err) => {
        if (err.codeName === 'NamespaceNotFound') {
          console.log('ignore name space not found error');
        } else {
          throw err;
        }
      }));
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

    // In mongo db there no remove foreign key constraint on authorId
    it.skip('should return Promise<IdentiryNotFoundError> when autorId not exists', () => {
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
    before(() => Post.insertMany(defaultPosts)
      .then(() => Vote.create(defaultVote)));
    after(() => Vote.collection.collectionName);
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
          expect(posts[0].postId.equals(defaultPosts[1].postId)).to.be.true;
          // expect(posts[0].postId).to.equal(2);
        });
    });

    it('should sort by votes when options.sort is hot', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'hot' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId.equals(defaultPosts[2].postId));
          expect(posts[1].postId.equals(defaultPosts[1].postId));
          expect(posts[2].postId.equals(defaultPosts[0].postId));
        });
    });

    it('should sort by votes when options.sort is new', () => {
      return postRepository.findUnder(defaultCommunity.communityName, { sort: 'hot' })
        .then((posts) => {
          expect(posts).to.lengthOf(3);
          expect(posts[0].postId.equals(defaultPosts[2].postId));
          expect(posts[1].postId.equals(defaultPosts[1].postId));
          expect(posts[2].postId.equals(defaultPosts[0].postId));
        });
    });

    it('should find posts when communityName is null', () => {
      return postRepository.findUnder(null)
      .then((posts) => {
        expect(posts).to.lengthOf(3);
      });
    });
  });
});
