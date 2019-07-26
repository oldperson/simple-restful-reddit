/**
 * @class Construct a repository providing generic operations on the resource.
 * @param {Object} sequelizeModel Set up sequelize model to access specific table of database.
 */
class GenericCachedRepository {
  constructor(redisClient, repository) {
    this.redisClient = redisClient;
    this.repository = repository;
  }

  /**
 * Create new model.
 * @param {object} data
 * @returns {Promise<object>}
 */
  create(data) {
    return this.repository.create(data);
  }

  /**
 * Find one model meet the condition .
 * @param {object} where Values for search.
 * @returns {Promise<object>} Finded model.
 */
  findOne(where) {
    return this.repository.findOne(where);
  }

  /**
 * Update properties of models.
 * @param {object} changes Valuse would be changed.
 * @param {*} where Values for find the models should be changed.
 * @returns {Promise<Array<object>} Array of updated model.
 */
  update(changes, where) {
    return this.repository.update(changes, where);
  }

  /**
   * Find models meet the condition.
   * @param {object} where Values for search.
   * @param {object|Array<string>} attributes Optional, the attributes of returns.
   * @param {Array<string>} attributes.include Optional, the add additional
   * attributes to returns.
   * @param {Array<string>} attributes.exclude Optional, the exclude attributes from returns.
   */
  findAll(where, attributes) {
    return this.repository.findAll(where, attributes);
  }
}

module.exports = GenericCachedRepository;
