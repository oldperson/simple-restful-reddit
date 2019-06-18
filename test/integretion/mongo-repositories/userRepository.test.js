const { expect } = require('chai');
const { mongoose, User } = require('../../../odm/models');
const { UserRepository } = require('../../../mongo-repositories/userRepository');
const { IncorrectPasswordError, UserNotFoundError, ValueAlreadyExistsError } = require('../../../mongo-repositories/errors');

describe('UserRepository', () => {
  const userRepository = new UserRepository(User);

  beforeEach(() => mongoose.connection.dropCollection(User.collection.collectionName)
    .then(() => User.create({
      userName: 'test1',
      // p@ssw@d hashed by bcrypt
      passwordHash: '$2b$10$W8yN9tW2gR3OM1Yd2E9gxeau/fYZHmiX/roNBxiVm/memDbj0lh2e',
      email: 'test',
    })));

  it('create',
    () => userRepository.create({
      userName: 'test',
      password: 'tess123',
      email: 'test@mail.com',
    }).then((model) => {
      expect(model).to.exist;
    }));
  it('when the userName already exists, should return Promise<ValueAlreadyExistsError>', () => userRepository.create({
    userName: 'test1',
    password: 'tess123',
    email: 'test@mail.com',
  }).catch((error) => {
    expect(error).is.instanceOf(ValueAlreadyExistsError);
  }));
  // TODO: Add test suite for generic repository motheds.

  it('when user is verified, should return Promise<user>', () => userRepository.verify({
    userName: 'test1',
    password: 'p@ssw@d',
  }).then((user) => {
    expect(user).exist;
  }));

  it('when password is incorrect, should return Promis<IncorrectPasswordError>', () => userRepository.verify({
    userName: 'test1',
    password: 'aaaaaa',
  }).catch((error) => {
    expect(error).to.be.instanceOf(IncorrectPasswordError);
  }));

  it('when username is not found, should return Promis<UserNotFoundError>', () => userRepository.verify({
    userName: '1111',
    password: 'p@ssw@d',
  }).catch((error) => {
    expect(error).to.be.instanceOf(UserNotFoundError);
  }));
});
