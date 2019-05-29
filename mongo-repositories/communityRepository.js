const GenericRepository = require('./genericRepository');
const { ValueAlreadyExistsError } = require('../repositories/errors');

/**
 * @class Construct a community repository
 * @param {Object} communityModel Set up model to access resources.
 */
class CommunityRepository extends GenericRepository {
  create(community) {
    return super.create(community)
      .catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
          throw new ValueAlreadyExistsError('communityName', community.communityName);
        }
        throw error;
      });
  }
}
module.exports.CommunityRepository = CommunityRepository;
