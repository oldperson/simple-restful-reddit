const express = require('express');
const communityRepository = require('../repositories/communityRepository').instance;
const postRepository = require('../repositories/postRepository').instance;

const router = express.Router();

router.post('/', (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({});
  }
  return communityRepository.create(req.body)
    .then(community => res.status(201).json(community))
    .catch(error => next(error));
});

router.post('/:communityName/posts/', (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({});
  }
  const post = Object.assign({ authorId: req.user.userId }, req.body);
  return postRepository.createUnder(req.params.communityName, post)
    .then(posted => res.status(201).json(posted))
    .catch(error => next(error));
});
module.exports = router;
