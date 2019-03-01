const { expect } = require('chai');
const { sequelize } = require('../../../orm/models');
const UserRepository = require('../../../repositories/userRepository').instance;

const userRepository = UserRepository.instance;

describe('UserRepository', () => {
  beforeEach(() => sequelize.sync({ force: true }));

  it('create', () => userRepository.create(
    {
      userName: 'test',
      passwordHash: 'password',
      email: 'test@email.com',
    },
  ).then((model) => { expect(model).exist; }));

  // TODO: Add test suite for generic repository motheds.
});
