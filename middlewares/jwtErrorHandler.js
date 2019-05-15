const { UnauthorizedError } = require('express-jwt');
const { createErrorBody } = require('../formats/responseBody');

/**
 * Return a express middleware that handle errors of JWT authentication.
 * The middleware would response HTTP 401 if authentication fail,
 *  else it would pass error to next handler.
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {function}
 */
function jwtErrorHandler(err, req, res, next) {
  if (err instanceof UnauthorizedError) {
    const message = `Token authentication fail. [${err.code}] ${err.message}`;
    return res.status(401).json(createErrorBody(message));
  }
  return next(err);
}

module.exports = jwtErrorHandler;
