// dependencies
const { promisify } = require('util');
const express = require('express');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository').instance;
const { UserNotFoundError, IncorrectPasswordError } = require('../repositories/errors');
const { createErrorBody } = require('../formats/responseBody');

// constants
const router = express.Router();
const jwtSign = promisify(jwt.sign);
const secret = process.env.JWT_SECRET_KEY;

// methods

// create authenticaton token
router.post('/', (req, res, next) => {
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

module.exports = router;
