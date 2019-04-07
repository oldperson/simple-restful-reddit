
const { hash, compare } = require('bcrypt');
const GenericRepository = require('./genericRepository');
const { UserNotFoundError, IncorrectPasswordError, ValueAlreadyExistsError } = require('./errors');

/**
 * The cost factor controls how many calculations to hash the password,
 * and calculations = 10^rounds.
 */
const rounds = 10;
/**
 * @class  Construct a user repository.
 * @param {Object} userModel Set up model to access resources.
 */
class UserRepository extends GenericRepository {
  /**
   * Create new user in the resource.
   * @param {string} user.userName
   * @param {string} user.email
   * @param {string} user.password
   * @returns {Promise<model>|Promise<Error>}
   */
  create({ userName, email, password }) {
    return hash(password, rounds)
      .then(passwordHash => super.create({ userName, email, passwordHash }))
      .catch(((error) => {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new ValueAlreadyExistsError('userName', userName);
        }
        throw error;
      }));
  }

  /**
   * Return Promise<Object> if the user verified.
   * If username is not found or password is incorrect,
   *  return Promise<UserNotFoundError | IncorrectPasswordError>.
   * @param {string} user.userName
   * @param {string} user.password
   */
  verify({ userName, password }) {
    let user;
    return this.sequelizeModel.findOne({ where: { userName } })
      .then((model) => {
        if (!model) {
          throw new UserNotFoundError();
        }
        user = model;
        return compare(password, model.passwordHash);
      })
      .then((passwordCorrect) => {
        if (!passwordCorrect) {
          throw new IncorrectPasswordError();
        }
        return user.toJSON();
      });
  }
}

module.exports.UserRepository = UserRepository;
