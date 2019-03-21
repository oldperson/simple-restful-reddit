const express = require('express');
const communityRepository = require('../repositories/communityRepository').instance;
const postRepository = require('../repositories/postRepository').instance;

const router = express.Router();

router.post('/', (req, res, next) => communityRepository.create(req.body)
  .then(community => res.status(201).json(community))
  .catch(error => next(error)));

router.post('/:communityName/posts/', (req, res, next) => {
  const post = Object.assign({ authorId: req.user.userId }, req.body);
  return postRepository.createUnder(req.params.communityName, post)
    .then(posted => res.status(201).json(posted))
    .catch(error => next(error));
});
module.exports = router;
