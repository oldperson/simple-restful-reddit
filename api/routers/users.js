
// dependencies
const express = require('express');

// methods
// create user
const router = express.Router();

// creat user
router.post('/', (req, res) => {
  res.json(req.body);
});

// find posts of user
router.get('/:name/posts', (req, res) => {
  res.send(`posts of name: ${req.params.name}`);
});

module.exports = router;
