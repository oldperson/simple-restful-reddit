const RepositoryError = require('../repositories/errors');
const { createErrorBody } = require('../formats/responseBody');
/**
 * Express middleware handles the repository errors,
 *  other errors will pass to next handler.
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function repositoryErrorHandler(err, req, res, next) {
  let status;
  if (err instanceof RepositoryError.ValueAlreadyExistsError) {
    status = 409;
  }

  if (!status) {
    return next(err);
  }
  return res.status(status).json(createErrorBody(err));
}
module.exports.repositoryErrorHandler = repositoryErrorHandler;
