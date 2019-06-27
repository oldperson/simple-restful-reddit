const { expect } = require('chai');
const {
  User, Post, Community, Comment, sequelize,
} = require('../../../orm/models');
const GenericRepositoy = require('../../../repositories/genericRepository');
const { EntityNotFoundError, IdentityNotFoundError } = require('../../../repositories/errors');

const defaultUser = {
  userId: 1,
  userName: 'test',
  passwordHash: 'tess123',
  email: 'test@mail.com',
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

describe('GenericRepository', () => {
  const userRepository = new GenericRepositoy(User);
  const commentRepository = new GenericRepositoy(Comment);

  before(() => sequelize.sync({ force: true })
    .then(() => User.create(defaultUser))
    .then(() => Community.create(defaultCommunity))
    .then(() => Post.create(defaultPost)));

  describe('create', () => {
    afterEach(() => User.truncateIgnoreFK());
    it('should create new model',
      () => userRepository.create({
        userName: 'test2',
        passwordHash: 'thisispasswordhash',
        email: 'myemail@gmail.com',
      }).then((model) => {
        expect(model).to.exist;
      }));

    it('should return Promise<IdentityNotFoundError> when violate foreign key constraint',
      () => commentRepository.create({
        commentId: 1,
        postId: 99,
        authorId: 1,
        content: 'expected comment',
      }).then(() => expect.fail())
        .catch(error => expect(error).to.be.instanceof(IdentityNotFoundError)));
  });

  describe('findOne', () => {
    before(() => User.create(defaultUser));
    after(() => User.truncateIgnoreFK());
    it('should find one model', () => userRepository.findOne({ userName: defaultUser.userName })
      .then((model) => {
        expect(model).exist;
      }));
    it('should return Promise<EntityNotFoundError> when entity is not found', () => userRepository.findOne({ userName: 'notExists' })
      .then(() => {
        expect().fail();
      })
      .catch((error) => {
        expect(error).instanceOf(EntityNotFoundError);
      }));
  });

  describe('update', () => {
    before(() => User.create(defaultUser));
    after(() => User.truncateIgnoreFK());
    it('should return Promise<Array<model>> when updated success', () => userRepository
      .update({ email: 'updated@eamil.com' }, { userName: defaultUser.userName })
      .then((models) => {
        expect(models).to.length(1);
        expect(models[0].email).to.equal('updated@eamil.com');
      }));

    it('should return Promise<EntityNotFoundError> when no entities found',
      () => userRepository.update({ email: 'updated@eamil.com' }, { userName: 'notFound' })
        .then(() => {
          expect.fail();
        })
        .catch((error) => {
          expect(error).instanceOf(EntityNotFoundError);
        }));
  });

  describe('findAll', () => {
    before(() => User.create(defaultUser));
    after(() => User.truncateIgnoreFK());
    it('should find all models', () => userRepository.findAll({ userName: 'test' })
      .then((models) => {
        expect(models).to.instanceOf(Array);
        expect(models[0]).to.include(defaultUser);
      }));
    it('should exclude attributes', () => {
      const attributes = {
        exclude: ['passwordHash'],
      };
      return userRepository.findAll({ userName: defaultUser.userName }, { attributes })
        .then((models) => {
          expect(models).to.length(1);
          expect(models[0]).to.not.have.keys('passwordHash');
        });
    });
  });
});
