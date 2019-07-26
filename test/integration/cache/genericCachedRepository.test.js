const { expect } = require('chai');
const sinon = require('sinon');

const GenericCachedRepository = require('../../../cache/genericCachedRepository');

const redisClient = {};
const repository = {
  create: sinon.stub().resolves(),
  findOne: sinon.stub().resolves(),
  findAll: sinon.stub().resolves(),
  update: sinon.stub().resolves(),
};

const genericCachedRepository = new GenericCachedRepository(redisClient, repository);

describe('GenericCachedRepository', () => {
  afterEach(() => sinon.restore());

  describe('create', () => {
    it('should call this.create()', () => genericCachedRepository.create({}).then(() => {
      expect(repository.create.args[0]).to.length(1);
      expect(repository.create.called).to.be.true;
    }));

    it('should call this.findOne()', () => genericCachedRepository.findOne({}).then(() => {
      expect(repository.findOne.args[0]).to.length(1);
      expect(repository.findOne.called).to.be.true;
    }));

    it('should call this.findAll()', () => genericCachedRepository.findAll({}, {}).then(() => {
      expect(repository.findAll.args[0]).to.length(2);
      expect(repository.findAll.called).to.be.true;
    }));

    it('should call this.update()', () => genericCachedRepository.update({}, {}).then(() => {
      expect(repository.update.args[0]).to.length(2);
      expect(repository.update.called).to.be.true;
    }));
  });
});
