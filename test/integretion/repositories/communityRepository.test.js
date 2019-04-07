const { expect } = require('chai');
const { sequelize, Community } = require('../../../orm/models');
const { CommunityRepository } = require('../../../repositories/communityRepository');
const { ValueAlreadyExistsError } = require('../../../repositories/errors');

const communityRepository = new CommunityRepository(Community);
describe('CommunityRepository', () => {
  before(() => sequelize.sync({ force: true }));
  describe('creat', () => {
    const defaultCommunity = {
      communityName: 'TestCom',
    };
    beforeEach(() => Community.truncate().then(() => Community.create(defaultCommunity)));

    it('should return Promise<ValueAlreadyExistsError> when communityName is already exists',
      () => communityRepository.create(defaultCommunity)
        .catch((error) => { expect(error).to.be.instanceof(ValueAlreadyExistsError); }));
  });
});
