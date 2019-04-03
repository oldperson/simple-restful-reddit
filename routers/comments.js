const express = require('express');
const commentRepository = require('../repositories/commentRepository').instance;
const schemas = require('../validation/schemas');
const { validate } = require('../middlewares/valiationHandler');

const router = express.Router();

router.get('/:commentId/replies', (req, res, next) => {
  commentRepository.findAll({ parentCommentId: req.params.commentId })
    .then(comments => res.status(200).json(comments))
    .catch(error => next(error));
});

router.post('/:commentId/replies', validate(schemas.newComment), (req, res, next) => {
  req.body.parentCommentId = req.params.commentId;
  req.body.authorId = req.user.userId;
  commentRepository.create(req.body)
    .then(replied => res.status(201).json(replied))
    .catch(error => next(error));
});

module.exports = router;
