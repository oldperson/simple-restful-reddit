
const express = require('express');

const router = express.Router();

// methods

// get posts of specific community
router.get('/:name/posts', (req, res) => {
  res.json(
    {
      name: req.params.name,
      posts: [{ id: '12314' }],
    },
  );
});

// get communites whith sort limit offet query
router.get('', (req, res) => {
  res.json(
    {
      communities: [
        { name: 'reddit' },
      ],
    },
  );
});

// caret new community
router.post('', (req, res) => {
  res.status(201);
});

module.exports = router;
