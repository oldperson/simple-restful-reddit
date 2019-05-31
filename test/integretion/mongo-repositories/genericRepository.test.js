/* eslint-disable no-underscore-dangle */
const { expect } = require('chai');
const { User, mongoose } = require('../../../odm/models/index.js');
const GenericRepositoy = require('../../../mongo-repositories/genericRepository');
const { EntityNotFoundError } = require('../../../repositories/errors');

const { ObjectId } = mongoose.Types;

const defaultModel = {
  _id: ObjectId('5ceff1aef7c93579889f8b26'),
  userName: 'test',
  passwordHash: 'tess123',
  email: 'test@mail.com',
};
const notExistId = ObjectId('5ceff2c9bd07b07e659068d5');

describe('GenericRepository', () => {
  const repository = new GenericRepositoy(User);
  before(() => mongoose.connection.dropDatabase());

  describe('create', () => {
    afterEach(() => mongoose.connection.dropCollection(User.collection.collectionName));
    it('should create new model',
      () => repository.create(defaultModel)
        .then((model) => {
          expect(model).to.exist;
        }));
  });

  describe('findOne', () => {
    before(() => User.create(defaultModel));
    after(() => mongoose.connection.dropCollection(User.collection.collectionName));
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
    after(() => mongoose.connection.dropCollection(User.collection.collectionName));
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
    after(() => mongoose.connection.dropCollection(User.collection.collectionName));
    it('should find all models', () => repository.findAll({ userName: 'test' })
      .then((models) => {
        expect(models).to.instanceOf(Array);
        expect(models[0]).to.exist;
        expect(models[0].userName).to.equal('test');
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

  describe('findById', () => {
    before(() => User.create(defaultModel));
    after(() => mongoose.connection.dropCollection(User.collection.collectionName));
    it('should return Promise<model> when id is found', () => repository.findById(defaultModel._id)
      .then((model) => {
        expect(model).exist;
        expect(model.userId.equals(defaultModel._id)).to.be.true;
      }));

    it('should return Promise<EntityNotFoundError> when the id is not found', () => repository.findById(notExistId)
      .then(() => {
        expect().to.fail();
      })
      .catch((err) => {
        expect(err).instanceof(EntityNotFoundError);
      }));
  });

  describe('findByIdAndUpdate', () => {
    before(() => User.create(defaultModel));
    after(() => mongoose.connection.dropCollection(User.collection.collectionName));
    it('should return Promise<model> when updated success', () => repository
      .findByIdAndUpdate({ email: 'updated@eamil.com' }, defaultModel._id)
      .then((model) => {
        expect(model).to.exist;
        expect(model.email).to.equal('updated@eamil.com');
      }));

    it('should return Promise<EntityNotFoundError> when no entities found',
      () => repository.findByIdAndUpdate({ email: 'updated@eamil.com' }, notExistId)
        .then(() => {
          expect.fail();
        })
        .catch((error) => {
          expect(error).instanceOf(EntityNotFoundError);
        }));
  });
});
