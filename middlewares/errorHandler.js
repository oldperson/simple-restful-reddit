const { createErrorBody } = require('../formats/responseBody');

/**
 * Return a express middleware to handle error.
 * If evn = 'production' it would give a customized response with
 * http status 500 and
 * body { message: 'Internal Server Error },
 * else it would pass error to next handler.
 * @param {string} env
 * @returns {function}
 */
function errorHandler(env) {
  if (env === 'production') {
    // eslint-disable-next-line no-unused-vars
    return function (err, req, res, next) {
      console.error(`${new Date().toLocaleString()} ${err.stack}`);
      return res.status(500).json(createErrorBody('Internal Server Error'));
    };
  }
  return function (err, req, res, next) {
    return next(err);
  };
}

module.exports = errorHandler;
