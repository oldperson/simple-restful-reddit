
const { User } = require('../orm/models');
const GenericRepository = require('../repositories/genericRepository');

/**
 * @class  Construct a user repository.
 * @param {Object} userModel Set up model to access resources.
 */
class UserRepository extends GenericRepository {
  constructor(userModel) {
    super(userModel || User);
  }
}


// TODO: Add dependency injection or singleton.
module.exports = UserRepository;
module.exports.instance = new UserRepository();
