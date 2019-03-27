const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const usersRouter = require('./routers/users');
const authTokensRouter = require('./routers/authTokens');
const communityRouter = require('./routers/communities');
const jwtErrorHandler = require('./middlewares/jwtErrorHandler');
const repositoryErrorHandler = require('./middlewares/repositoryErrorHandler');
const authorizationHandler = require('./middlewares/authoriztionHandler');

const port = process.env.port || 3000;
const secret = process.env.JWT_SECRET_KEY;
const app = express();

app.listen(port, () => {
  console.log(`listening port ${port}`);
  console.error(`listening port ${port}`);
});

// ---------- middlewares-------------
app.use(bodyParser.json());
app.use(jwt({ secret, credentialsRequired: false })); // if auth token exists, add req.user
app.use(authorizationHandler.unless({
  method: ['GET'],
  path: [
    { url: '/users', methods: ['POST'] },
    { url: '/authTokens', methods: ['POST'] },
  ],
}));

// ----------routers------------------
app.use('/users', usersRouter);
app.use('/authTokens', authTokensRouter);
app.use('/communities', communityRouter);

app.get('/hello/:name', (req, res) => {
  res.status(200).send(`hello ${req.params.name}`);
});

// -------errorHandlers---------------
app.use(jwtErrorHandler);
app.use(repositoryErrorHandler);

module.exports = app;
