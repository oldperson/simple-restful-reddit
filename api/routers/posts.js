// dependencies
const express = require('express');

const router = express.Router();

// Methods
// get comments of posts
router.get('/:postId/comments', (req, res) => {
  res.json({
    message: `communityId:${req.params.communityId} postId:${res.params.possId}`,
  });
});

// create new post
router.post('/', (req, res) => {
  res.json({
    communityId: 'communityId',
    userId: 'userId',
  });
});

router.path = '/posts';
module.exports = router;
