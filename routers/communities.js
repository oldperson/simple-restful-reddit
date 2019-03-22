const express = require('express');
const _ = require('lodash');
const communityRepository = require('../repositories/communityRepository').instance;
const postRepository = require('../repositories/postRepository').instance;

const router = express.Router();

router.post('/', (req, res, next) => communityRepository.create(req.body)
  .then(community => res.status(201).json(community))
  .catch(error => next(error)));

router.post('/:communityName/posts/', (req, res, next) => {
  const post = _.cloneDeep(req.body);
  post.authorId = req.user.userId;
  post.communityName = req.params.communityName;
  return postRepository.createUnder(req.params.communityName, post)
    .then(posted => res.status(201).json(posted))
    .catch(error => next(error));
});
module.exports = router;
