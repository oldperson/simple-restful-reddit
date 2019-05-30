const { ObjectId } = require('mongoose').Types;
const _ = require('lodash');

/**
 * Convert ObjectId string to ObjectId object.
 * If the feild is an id and the value is a string, return ObjectId of the value,
 *  else return origin value.
 * @private
 * @param {*} value
 * @param {*} field
 */
function toObjectId(value, field) {
  if ((field.endsWith('Id') || field === '_id') && typeof value === 'string') {
    return ObjectId(value);
  }
  return value;
}

/**
 * An Experss middleware wraps id string to objectId object in path parameters.
 * If the parameter name is '_id' or ends with 'Id',
 *  the parameter would be wrapped to ObjectId object,
 *  for further manipulation of mongoose.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {function}
 */
// eslint-disable-next-line no-unused-vars
function objectIdWrapper(req, res, next) {
  const params = _.mapValues(req.params, toObjectId);
  req.params = params;
  return next();
}

module.exports = objectIdWrapper;
