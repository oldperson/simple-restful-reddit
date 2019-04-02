const express = require('express');
const postRepository = require('../repositories/postRepository').instance;
const commentRepository = require('../repositories/commentRepository').instance;
const voteRepository = require('../repositories/voteRepository').instance;

const router = express.Router();

router.get('/:postId', (req, res, next) => {
  postRepository.findOne({ postId: req.params.postId })
    .then((post) => {
      if (!post) {
      // TODO: postId not found response 404
        return res.status(404);
      }
      return res.status(200).json(post);
    })
    .catch(error => next(error));
});

// TODO: postId not found response 404
router.get('/:postId/comments', (req, res, next) => {
  commentRepository.findAll({ postId: req.params.postId })
    .then(comments => res.status(200).json(comments))
    .catch(error => next(error));
});

router.post('/:postId/comments', (req, res, next) => {
  req.body.authorId = req.user.userId;
  req.body.postId = req.params.postId;
  commentRepository.create(req.body)
    .then(comment => res.status(201).json(comment))
    .catch(error => next(error));
});

router.put('/:postId/votes', (req, res, next) => {
  req.body.userId = req.user.userId;
  req.body.postId = req.params.postId;
  voteRepository.createOrUpdate(req.body)
    .then(() => res.send(200))
    .catch(error => next(error));
});

module.exports = router;
