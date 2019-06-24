const express = require('express');
const schemas = require('../validation/schemas');
const { validate } = require('../middlewares/valiationHandler');

/**
 * Create post router
 * @param {object} options
 * @param {object} options.postRepository
 * @param {object} options.commentRepository
 * @param {object} options.voteRepository
 */
function create({ postRepository, commentRepository, voteRepository }) {
  const router = express.Router();

  router.get('/', validate(schemas.queryOptions), (req, res, next) => postRepository.findUnder(null, req.query)
    .then(posts => res.status(200).json(posts))
    .catch(error => next(error)));

  router.get('/:postId', (req, res, next) => {
    postRepository.findById(req.params.postId)
      .then(post => res.status(200).json(post))
      .catch(error => next(error));
  });

  router.patch('/:postId', (req, res, next) => {
    postRepository.findByIdAndUpdate(req.body, req.params.postId)
      .then(updated => res.status(200).json(updated))
      .catch(error => next(error));
  });

  router.get('/:postId/comments', (req, res, next) => {
    commentRepository.findAll({ postId: req.params.postId }, { exclude: ['parentCommentId'] })
      .then(comments => res.status(200).json(comments))
      .catch(error => next(error));
  });

  router.post('/:postId/comments', validate(schemas.newComment), (req, res, next) => {
    req.body.authorId = req.user.userId;
    req.body.postId = req.params.postId;
    commentRepository.create(req.body)
      .then(comment => res.status(201).json(comment))
      .catch(error => next(error));
  });

  router.put('/:postId/votes', validate(schemas.modifiedVote), (req, res, next) => {
    req.body.userId = req.user.userId;
    req.body.postId = req.params.postId;
    voteRepository.createOrUpdate(req.body)
      .then(voted => res.status(200).json(voted))
      .catch(error => next(error));
  });

  return router;
}
module.exports = create;
