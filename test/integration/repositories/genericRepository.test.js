const { expect } = require('chai');
const { User, sequelize } = require('../../../orm/models');
const GenericRepositoy = require('../../../repositories/genericRepository');
const { EntityNotFoundError } = require('../../../repositories/errors');

const defaultModel = {
  userName: 'test',
  passwordHash: 'tess123',
  email: 'test@mail.com',
};

describe('GenericRepository', () => {
  const repository = new GenericRepositoy(User);
  before(() => sequelize.sync({ force: true }));

  describe('create', () => {
    afterEach(() => User.truncateIgnoreFK());
    it('should create new model',
      () => repository.create(defaultModel)
        .then((model) => {
          expect(model).to.exist;
        }));
  });

  describe('findOne', () => {
    before(() => User.create(defaultModel));
    after(() => User.truncateIgnoreFK());
    it('should find one model', () => repository.findOne({ userName: defaultModel.userName })
      .then((model) => {
        expect(model).exist;
      }));
    it('should return Promise<EntityNotFoundError> when entity is not found', () => repository.findOne({ userName: 'notExists' })
      .then(() => {
        expect().fail();
      })
      .catch((error) => {
        expect(error).instanceOf(EntityNotFoundError);
      }));
  });

  describe('update', () => {
    before(() => User.create(defaultModel));
    after(() => User.truncateIgnoreFK());
    it('should return Promise<Array<model>> when updated success', () => repository
      .update({ email: 'updated@eamil.com' }, { userName: defaultModel.userName })
      .then((models) => {
        expect(models).to.length(1);
        expect(models[0].email).to.equal('updated@eamil.com');
      }));

    it('should return Promise<EntityNotFoundError> when no entities found',
      () => repository.update({ email: 'updated@eamil.com' }, { userName: 'notFound' })
        .then(() => {
          expect.fail();
        })
        .catch((error) => {
          expect(error).instanceOf(EntityNotFoundError);
        }));
  });

  describe('findAll', () => {
    before(() => User.create(defaultModel));
    after(() => User.truncateIgnoreFK());
    it('should find all models', () => repository.findAll({ userName: 'test' })
      .then((models) => {
        expect(models).to.instanceOf(Array);
        expect(models[0]).to.include(defaultModel);
      }));
    it('should exclude attributes', () => {
      const attributes = {
        exclude: ['passwordHash'],
      };
      return repository.findAll({ userName: defaultModel.userName }, { attributes })
        .then((models) => {
          expect(models).to.length(1);
          expect(models[0]).to.not.have.keys('passwordHash');
        });
    });
  });
});
