const { expect } = require('chai');
const { User, sequelize } = require('../../../orm/models');
const GenericRepositoy = require('../../../repositories/genericRepository');

const defaultModel = {
  userName: 'test',
  passwordHash: 'tess123',
  email: 'test@mail.com',
};

describe('GenericRepository', () => {
  const repository = new GenericRepositoy(User);
  before(() => sequelize.sync({ force: true }));

  describe('create', () => {
    afterEach(() => User.truncate());
    it('should create new model',
      () => repository.create(defaultModel)
        .then((model) => {
          expect(model).to.exist;
        }));
  });

  describe('findOne', () => {
    before(() => User.create(defaultModel));
    after(() => User.truncate());
    it('should find one model', () => repository.findOne({ userName: defaultModel.userName })
      .then((model) => { expect(model).exist; }));
  });

  describe('update', () => {
    before(() => User.create(defaultModel));
    after(() => User.truncate());
    it('should update model', () => repository
      .update({ email: 'updated@eamil.com' }, { userName: defaultModel.userName })
      .then((affectedCount) => { expect(affectedCount).equals(1); }));
  });

  describe('findAll', () => {
    before(() => User.create(defaultModel));
    after(() => User.truncate());
    it('should find all models', () => repository.findAll({ userName: 'test' })
      .then((models) => {
        expect(models).to.instanceOf(Array);
        expect(models[0]).to.include(defaultModel);
      }));
  });
});
