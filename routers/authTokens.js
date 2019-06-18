// dependencies
const { promisify } = require('util');
const express = require('express');
const jwt = require('jsonwebtoken');
const { UserNotFoundError, IncorrectPasswordError } = require('../mongo-repositories/errors');
const { createErrorBody } = require('../formats/responseBody');
const { validate } = require('../middlewares/valiationHandler');
const schemas = require('../validation/schemas');

// constants
const jwtSign = promisify(jwt.sign);

// methods
/**
 * Create an router deal with token authentiction
 * @param options
 * @param options.userRepository
 * @param options.secret sign the signature of JWT
 */
function create({ userRepository, secret }) {
  const router = express.Router();
  // create authenticaton token
  router.post('/', validate(schemas.newAuthToken), (req, res, next) => {
    userRepository.verify(req.body)
      .then(user => jwtSign({ userId: user.userId, userName: user.userName },
        secret,
        { expiresIn: '1h' }))
      .then(token => res.status(201).json({ token }))
      .catch((error) => {
        if (error instanceof UserNotFoundError || error instanceof IncorrectPasswordError) {
          return res.status(401).json(createErrorBody(error));
        }
        return Promise.reject(error);
      })
      .catch(error => next(error));
  });
  return router;
}

module.exports = create;
