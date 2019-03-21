const { expect } = require('chai');
const { sequelize, Community } = require('../../../orm/models');
const communityRespository = require('../../../repositories/communityRepository').instance;
const { ValueAlreadyExistsError } = require('../../../repositories/errors');

describe('CommunityRepository', () => {
  before(() => sequelize.sync({ force: true }));
  describe('creat', () => {
    const defaultCommunity = {
      communityName: 'TestCom',
    };
    beforeEach(() => Community.truncate().then(() => Community.create(defaultCommunity)));

    it('should return Promise<ValueAlreadyExistsError> when communityName is already exists',
      () => communityRespository.create(defaultCommunity)
        .catch((error) => { expect(error).to.be.instanceof(ValueAlreadyExistsError); }));
  });
});
