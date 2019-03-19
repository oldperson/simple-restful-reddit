const { expect } = require('chai');
const { User, sequelize } = require('../../../orm/models');
const GenericRepositoy = require('../../../repositories/genericRepository');


describe('GenericRepository', () => {
  const repository = new GenericRepositoy(User);

  beforeEach('reset db', () => sequelize.sync({ force: true }));

  it('create',
    () => repository.create({
      userName: 'test',
      passwordHash: 'tess123',
      email: 'test@mail.com',
    })
      .then((model) => {
        expect(model).to.exist;
      }));

  describe('', () => {
    beforeEach(() => User.create({
      userName: 'test',
      passwordHash: 'tess123',
      email: 'test@mail.com',
    }));

    it('findOne', () => repository.findOne({ userName: 'test' })
      .then((model) => { expect(model).exist; }));

    it('update', () => repository
      .update({ email: 'updated@eamil.com' }, { userName: 'test' })
      .then((affectedCount) => { expect(affectedCount).equals(1); }));
  });
});
