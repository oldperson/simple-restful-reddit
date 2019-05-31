const { EntityNotFoundError } = require('../repositories/errors');

/**
 * Convert included/exciuded attrubutes to mongoose select string.
 * https://mongoosejs.com/docs/api.html#query_Query-select
 * @param {*} attributes
 * @returns {string}
 */
function select(attributes) {
  let selected = null;
  if (attributes && attributes.include) {
    selected = attributes.include.reduce((acc, cur) => `${acc} +${cur}`, '');
  }
  if (attributes && attributes.exclude) {
    selected = attributes.exclude.reduce((acc, cur) => `${acc} -${cur}`, '');
  }
  return selected;
}

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
    const selected = select(attributes);
    return this.mongooseModel.find(where, selected)
      .exec();
  }

  /**
   * Find model by id, the same as findOne({ _id: id }).
   * @param {ObjectId|string} id
   * @param {object|Array<string>} attributes Optional, the attributes of returns.
   * @param {Array<string>} attributes.include Optional, the add additional
   * attributes to returns.
   * @param {Array<string>} attributes.exclude Optional, the exclude attributes from returns.
   */
  findById(id, attributes) {
    const selected = select(attributes);
    return this.mongooseModel.findById(id, selected)
      .exec()
      .then((model) => {
        if (!model) {
          return Promise.reject(new EntityNotFoundError());
        }
        return model.toJSON();
      });
  }

  /**
   * Find the model by id and update the finded model,
   *  same as findOneAndUpdata({ _id: id}, changes).
   * @param {object} changes  Feilds and values should be changed.
   * @param {ObjectId|string} id
   */
  findByIdAndUpdate(changes, id) {
    const options = {
      new: true, // return modified document
    };
    return this.mongooseModel.findByIdAndUpdate(id, changes, options)
      .exec()
      .then((model) => {
        if (!model) {
          return Promise.reject(new EntityNotFoundError());
        }
        return model.toJSON();
      });
  }
}
module.exports = GenericRepository;
