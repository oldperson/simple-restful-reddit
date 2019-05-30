const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const db = require('./odm/models');
const { UserRepository } = require('./mongo-repositories/userRepository');
const { CommentRepository } = require('./mongo-repositories/commentRepository');
const { CommunityRepository } = require('./mongo-repositories/communityRepository');
const { PostRepository } = require('./mongo-repositories/postRepository');
const { VoteRepository } = require('./mongo-repositories/voteRepository');

const createAuthTokensRouter = require('./routers/authTokens');
const createUserRouter = require('./routers/users');
const createCommunityRouter = require('./routers/communities');
const createPostRouter = require('./routers/posts');
const createCommentRouter = require('./routers/comments');
const jwtErrorHandler = require('./middlewares/jwtErrorHandler');
const repositoryErrorHandler = require('./middlewares/repositoryErrorHandler');
const authorizationHandler = require('./middlewares/authoriztionHandler');

const port = process.env.PORT || 3000;
const secret = process.env.JWT_SECRET_KEY;

/* --------------------------- create repositories -------------------------- */
const userRepository = new UserRepository(db.User);
const commentRepository = new CommentRepository(db.Comment);
const communityRepository = new CommunityRepository(db.Community);
const postRepository = new PostRepository(db.Post);
const voteRepository = new VoteRepository(db.Vote);

/* ----------------------------- create routers ----------------------------- */
const authTokensRouter = createAuthTokensRouter({ userRepository, secret });
const commentRouter = createCommentRouter({ commentRepository });
const communityRouter = createCommunityRouter({ communityRepository, postRepository });
const postRouter = createPostRouter({ postRepository, commentRepository, voteRepository });
const usersRouter = createUserRouter({ userRepository });

/* ---------------------------- init application ---------------------------- */
const app = express();
app.listen(port, () => {
  console.log(`listening port ${port}`);
});

/* --------------------- register pre-router middlewares -------------------- */
app.use(bodyParser.json());
app.use(jwt({ secret, credentialsRequired: false })); // if auth token exists, add req.user
app.use(authorizationHandler.unless({
  method: ['GET'],
  path: [
    { url: '/users', methods: ['POST'] },
    { url: '/authTokens', methods: ['POST'] },
  ],
}));

/* ---------------------------- register routers ---------------------------- */
app.use('/users', usersRouter);
app.use('/authTokens', authTokensRouter);
app.use('/communities', communityRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.get('/hello/:name', (req, res) => {
  res.status(200).send(`hello ${req.params.name}`);
});

/* ---------------------- register post error handlers ---------------------- */
app.use(jwtErrorHandler);
app.use(repositoryErrorHandler);

module.exports = app;
