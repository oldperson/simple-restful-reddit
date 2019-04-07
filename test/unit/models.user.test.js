// dependencies
const { expect } = require('chai');
const { Op } = require('sequelize');
const { User, sequelize } = require('../../orm/models');

// tests
describe('Ueser model', function () {
  before(() => {
    sequelize.sync({ force: true });
    User.create({
      userName: 'testName',
      email: 'test@gmail.com',
      passwordHash: 'aaaaaaa',
    }).then(function () {});
  });
  // beforeEach(function () {
  //   sequelize.sync({ force: true });
  // });
  it('create', function () {
    return User.create({
      userName: 'testName',
      email: 'test@gmail.com',
      passwordHash: 'aaaaaaa',
    }).then(function (user) {
      expect(user.userName).equal('testName1');
    });
  });

  it('count', function () {
    return User.count({ where: { userName: { [Op.eq]: 'testName' } } }).then((c) => {
      expect(c).equal(1);
    });
  });

  it('get by userid', function () {
    User.findById(1).then((user) => {
      expect(user).to.be.null;
    });
  });

  it('find by name', function () {
    User.findOne({ where: { userName: { [Op.eq]: 'AAA' } } }).then((user) => {
      expect(user).to.be.null;
    });
  });

  it('create then update', function () {
    return User.create({
      userName: 'testName',
      email: 'test@gmail.com',
      passwordHash: 'aaaaaaa',
    })
      .then(function (user) {
        return user.update({ email: 'updated@google.com' });
      })
      .then(() => {
      });
  });


  it('test expext', () => {
    expect('aaa').equal('aaa');
  });
});
