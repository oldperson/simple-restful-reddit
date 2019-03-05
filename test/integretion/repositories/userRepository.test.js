const { expect } = require('chai');
const { sequelize, User } = require('../../../orm/models');
const UserRepository = require('../../../repositories/userRepository');
const { IncorrectPasswordError, UserNotFoundError } = require('../../../repositories/errors');

describe('UserRepository', () => {
  const userRepository = UserRepository.instance;

  beforeEach(() => sequelize.sync({ force: true })
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

  it('when username is not found, should return Promis<UserNotFoundError>', () => { 
    return userRepository.verify({
      userName: '1111',
      password: 'p@ssw@d',
    }).catch((error) => {
      expect(error).to.be.instanceOf(UserNotFoundError);
    });
  });
});
