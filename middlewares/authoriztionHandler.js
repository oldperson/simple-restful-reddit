const unless = require('express-unless');
const { createErrorBody } = require('../formats/responseBody');
// eslint-disable-next-line no-unused-vars
function authorize(route, user) {
  // TODO: add authorization
  return true;
}
/**
 * A express middleware handles authorization,
 *  go to next handler if user has authority to access the resource
 *  response 401 if lack of identity,
 *  response 403 if user has no authority to access the resource,
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function authorizationHandler(req, res, next) {
  if (!req.user) {
    return res.status(401).json(createErrorBody('this action should be authenticated'));
  }
  if (!authorize(req.route, req.user)) {
    return res.status(403).json(createErrorBody('user has no authority to access the resource'));
  }
  return next();
}
authorizationHandler.unless = unless;
module.exports = authorizationHandler;
