const GenericRepository = require('./genericRepository');
const { Community, Sequelize } = require('../orm/models');
const { ValueAlreadyExistsError } = require('./errors');

/**
 * @class Construct a community repository
 * @param {Object} communityModel Set up model to access resources.
 */
class CommunityRepository extends GenericRepository {
  constructor(communityModel) {
    super(communityModel || Community);
  }

  create(community) {
    return super.create(community)
      .catch((error) => {
        if (error instanceof Sequelize.UniqueConstraintError) {
          throw new ValueAlreadyExistsError('communityName', community.communityName);
        }
        throw error;
      });
  }
}
module.exports = CommunityRepository;
module.exports.instance = new CommunityRepository();
