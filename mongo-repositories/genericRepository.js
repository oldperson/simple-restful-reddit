const { EntityNotFoundError } = require('../repositories/errors');

/**
 * @class Construct a repository providing generic operations on the resource.
 * @param {Object} mongooseModel Set up sequelize model to access specific table of database.
 */
class GenericRepository {
  constructor(mongooseModel) {
    this.mongooseModel = mongooseModel;
  }

  /**
 * Create new model.
 * @param {object} data
 * @returns {Promise<object>}
 */
  create(data) {
    return this.mongooseModel.create(data)
      .then(model => model.toJSON());
  }

  /**
 * Find one model meet the condition .
 * @param {object} where Values for search.
 * @returns {Promise<object>} Finded model.
 */
  findOne(where) {
    return this.mongooseModel.findOne(where)
      .exec()
      .then((model) => {
        if (!model) {
          return Promise.reject(new EntityNotFoundError());
        }
        return Promise.resolve(model.toJSON());
      });
  }

  /**
 * Update properties of models.
 * @param {object} changes Valuse would be changed.
 * @param {*} where Values for find the models should be changed.
 * @returns {Promise<Array<object>} Array of updated model.
 */
  update(changes, where) {
    return this.mongooseModel.updateOne(where, changes)
      .exec()
      .then((res) => {
        if (res.nModified === 0) {
          return Promise.reject(new EntityNotFoundError());
        }
        return Promise.resolve();
      })
      .then(() => this.mongooseModel.find(where).exec());
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
    let select = null;
    if (attributes && attributes.include) {
      select = attributes.include.reduce((acc, cur) => `${acc} +${cur}`, '');
    }
    if (attributes && attributes.exclude) {
      select = attributes.exclude.reduce((acc, cur) => `${acc} -${cur}`, '');
    }
    return this.mongooseModel.find(where, select)
      .exec();
  }
}
module.exports = GenericRepository;
