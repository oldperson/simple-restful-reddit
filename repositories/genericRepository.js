const { IdentityNotFoundError } = require('./errors');

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
        if (error.name === 'SequelizeForeignKeyConstraintError') {
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
    return this.sequelizeModel.findOne({ where, raw: true });
  }

  /**
 * Update properties of models.
 * @param {object} changes Valuse would be changed.
 * @param {*} where Values for find the models should be changed.
 * @returns {Promise<Number>} affectedCount
 */
  update(changes, where) {
    return this.sequelizeModel.update(changes, { where })
      .then(([affectedCount]) => affectedCount);
  }

  /**
   * Find models meet the condition.
   * @param {object} where Values for search.
   */
  findAll(where) {
    return this.sequelizeModel.findAll({ where, raw: true });
  }
}

module.exports = GenericRepository;
