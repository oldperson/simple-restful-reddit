const express = require('express');
const bodyParser = require('body-parser');

const usersRouter = require('./api/routers/users');
const communitiesRouter = require('./api/routers/communities');
const authTokensRouter = require('./api/routers/authTokens');

const port = process.env.port || 3000;
const app = express();

app.listen(port, () => {
  console.log(`listening port ${port}`);
});

// middlewares
app.use(bodyParser.json());

// routers
app.use('/users', usersRouter);
app.use('/communities', communitiesRouter);
app.use('/authTokens', authTokensRouter);

app.get('/hello/:name', (req, res) => {
  res.status(200).send(`hello ${req.params.name}`);
});

module.exports = app;
