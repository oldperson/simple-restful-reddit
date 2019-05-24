/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const db = require('./index');

/**
 * Simply test the mongoose
 */
const kevin = {
  userName: 'kevin2',
  email: 'aaa@gmail.com',
  passwordHash: 'aaaaaaaaaaaaaaaaa',
};

let userCache;

db.User.create(kevin)
  .then((newUser) => {
    console.log(newUser);
    userCache = newUser;
    return db.Community.create({
      communityName: 'firstCom',
    });
  })
  .then((newCommunity) => {
    console.log(newCommunity);
    return db.Post.create({
      title: 'first post',
      content: 'the content',
      authorId: userCache._id,
      communityId: newCommunity._id,
    });
  })
  .then((newPost) => {
    console.log(newPost);
    return db.Comment.create({
      postId: newPost._id,
      content: 'the comment',
      authorId: userCache._id,
    });
  })
  .then((newComment) => {
    console.log(newComment);
    return db.Comment.create({
      postId: newComment.postId,
      content: 'the reply',
      parentCommentId: newComment._id,
      authorId: userCache._id,
    });
  })
  .then((newReply) => {
    console.log(newReply);
    return db.Vote.create({
      postId: newReply.postId,
      userId: newReply.authorId,
      value: 1,
    });
  })
  .then(newVote => console.log(newVote))
  .catch(err => console.log(err));
