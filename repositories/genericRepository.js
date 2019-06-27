const { IdentityNotFoundError, EntityNotFoundError, isForeignKeyError } = require('./errors');

/**
 * @class Construct a repository providing generic operations on the resource.
 * @param {Object} sequelizeModel Set up sequelize model to access specific table of database.
 */
class GenericRepository {
  constructor(sequelizeModel) {
    this.sequelizeModel = sequelizeModel;
  }

  /**
 * Create new model.
 * @param {object} data
 * @returns {Promise<object>}
 */
  create(data) {
    return this.sequelizeModel.create(data)
      .then(model => model.toJSON())
      .catch((error) => {
        if (isForeignKeyError(error)) {
          return Promise.reject(new IdentityNotFoundError());
        }
        return Promise.reject(error);
      });
  }

  /**
 * Find one model meet the condition .
 * @param {object} where Values for search.
 * @returns {Promise<object>} Finded model.
 */
  findOne(where) {
    return this.sequelizeModel.findOne({ where, raw: true })
      .then((model) => {
        if (!model) {
          return Promise.reject(new EntityNotFoundError());
        }
        return Promise.resolve(model);
      });
  }

  /**
 * Update properties of models.
 * @param {object} changes Valuse would be changed.
 * @param {*} where Values for find the models should be changed.
 * @returns {Promise<Array<object>} Array of updated model.
 */
  update(changes, where) {
    return this.sequelizeModel.update(changes, { where })
      .then(([affectedCount]) => {
        if (affectedCount === 0) {
          return Promise.reject(new EntityNotFoundError());
        }
        return Promise.resolve();
      })
      .then(() => this.sequelizeModel.findAll({ where, raw: true }));
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
    return this.sequelizeModel.findAll({ where, raw: true, attributes });
  }
}

module.exports = GenericRepository;
