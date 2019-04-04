// dependencies
const express = require('express');
const { validate } = require('../middlewares/valiationHandler');
const schemas = require('../validation/schemas');

/**
 * Create user router
 * @param {object} options
 * @param {object} options.userRepository
 */
function create({ userRepository }) {
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
  return router;
}
module.exports = create;
