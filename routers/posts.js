const express = require('express');
const scemas = require('../validation/schemas');
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

  router.get('/:postId', (req, res, next) => {
    postRepository.findOne({ postId: req.params.postId })
      .then((post) => {
        if (!post) {
          return res.status(404);
        }
        return res.status(200).json(post);
      })
      .catch(error => next(error));
  });

  router.get('/:postId/comments', (req, res, next) => {
    commentRepository.findAll({ postId: req.params.postId })
      .then(comments => res.status(200).json(comments))
      .catch(error => next(error));
  });

  router.post('/:postId/comments', validate(scemas.newComment), (req, res, next) => {
    req.body.authorId = req.user.userId;
    req.body.postId = req.params.postId;
    commentRepository.create(req.body)
      .then(comment => res.status(201).json(comment))
      .catch(error => next(error));
  });

  router.put('/:postId/votes', validate(scemas.modifiedVote), (req, res, next) => {
    req.body.userId = req.user.userId;
    req.body.postId = req.params.postId;
    voteRepository.createOrUpdate(req.body)
      .then(() => res.send(200))
      .catch(error => next(error));
  });

  return router;
}
module.exports = create;
