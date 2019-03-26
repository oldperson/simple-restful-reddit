const { checkSchema, validationResult } = require('express-validator/check');
const { createErrorBody } = require('../formats/responseBody');

/**
 * An express middleware handle the validation errors.
 * If validation failed respsone HTTP 422 and details of fails,
 * else pass request to next handler.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {function}
 */
function validationErrorHandler(req, res, next) {
  const results = validationResult(req);
  if (results.isEmpty()) {
    return next();
  }
  const body = createErrorBody('Validation Failed');
  body.details = results.array();
  return res.status(422).json(body);
}
module.exports.validationErrorHandler = validationErrorHandler;

/**
 * Return express middilewares to validate the request base on given schemas.
 * If the validation failed, the last middleware would response HTTP 422 and details of fails,
 * else it would pass request to next handler.
 * @param  {...any} schemas
 * @returns {Array<function>} validation middlewares
 */
function validate(...schemas) {
  const handlers = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const schema of schemas) {
    // eslint-disable-next-line no-restricted-syntax
    for (const validator of checkSchema(schema)) {
      handlers.push(validator);
    }
  }
  handlers.push(validationErrorHandler);
  return handlers;
}
module.exports.validate = validate;
