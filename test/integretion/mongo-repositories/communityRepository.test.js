const { expect } = require('chai');
const { mongoose, Community } = require('../../../odm/models');
const { CommunityRepository } = require('../../../mongo-repositories/communityRepository');
const { ValueAlreadyExistsError } = require('../../../repositories/errors');

const communityRepository = new CommunityRepository(Community);
describe('CommunityRepository', () => {
  //  before(() => mongoose.sync({ force: true }));
  describe('create', () => {
    const defaultCommunity = {
      communityName: 'TestCom',
    };

    beforeEach(() => mongoose.connection.dropCollection(Community.collection.collectionName)
      .then(() => Community.create(defaultCommunity)));

    it('should return Promise<ValueAlreadyExistsError> when communityName is already exists',
      () => communityRepository.create(defaultCommunity)
        .catch((error) => { expect(error).to.be.instanceof(ValueAlreadyExistsError); }));
  });
});
