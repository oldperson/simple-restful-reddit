const { createErrorBody } = require('../formats/responseBody');

const unauthorizedCodes = {
  invalid_token: true,
  credentials_bad_scheme: true,
  credentials_bad_format: true,
};

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
  if (err.code && unauthorizedCodes[err.code]) {
    return res.status(401).json(createErrorBody(err));
  }
  return next(err);
}

module.exports = jwtErrorHandler;
