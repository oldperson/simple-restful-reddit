// dependencies
const { expect } = require('chai');
const { User, sequelize } = require('../../orm/models');

// tests
describe('Ueser model', function () {
  beforeEach(function () {
    sequelize.sync({ force: true });
  });

  it('create', function () {
    User.create({
      userName: 'testName',
      email: 'test@gmail.com',
      passwordHash: 'aaaaaaa',
    }, (user) => {
      expect(user.userName).equal('testName');
    });
  });
});
