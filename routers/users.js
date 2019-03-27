// dependencies
const express = require('express');
const { createErrorBody } = require('../formats/responseBody');
const userRepository = require('../repositories/userRepository').instance;
const { ValueAlreadyExistsError } = require('../repositories/errors');

const { validate } = require('../middlewares/valiationHandler');
const schemas = require('../validation/schemas');
// methods
// create user
const router = express.Router();

// creat user
router.post('/', validate(schemas.newUser), (req, res, next) => {
  userRepository.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(error => next(error));
});

// find posts of user
router.get('/:name/posts', (req, res) => {
  res.send(`posts of name: ${req.params.name}`);
});

module.exports = router;
