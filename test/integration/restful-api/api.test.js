/* eslint-disable no-underscore-dangle */

const { promisify } = require('util');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const app = require('../../../app');
const {
  sequelize, User, Community, Post, Comment,
} = require('../../../orm/models');

const jwtSign = promisify(jwt.sign);

chai.use(chaiHttp);
const { expect } = chai;
const request = chai.request(app).keepOpen();

const defaultUser = {
  userId: 1,
  userName: 'test',
  passwordHash: '$2b$10$W8yN9tW2gR3OM1Yd2E9gxeau/fYZHmiX/roNBxiVm/memDbj0lh2e',
  email: 'test@gmail.com',
};
const defaultCommunity = {
  communityId: 1,
  communityName: 'testCom',
};
const defaultPost = {
  postId: 1,
  communityId: defaultCommunity.communityId,
  communityName: defaultCommunity.communityName,
  authorId: defaultUser.userId,
  title: 'testPost',
  content: 'hello',
};
const defaultComment = {
  commentId: 1,
  postId: defaultPost.postId,
  authorId: defaultUser.userId,
  content: 'expected comment',
};
const defaultReply = {
  parentCommentId: defaultComment.commentId,
  authorId: defaultUser.userId,
  content: 'expected reply',
};

let authToken;

describe('api tests', () => {
  before(() => sequelize.sync({ force: true })
    .then(() => User.create(defaultUser))
    .then(() => jwtSign({ userId: '1', userName: 'test' },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }))
    .then((token) => { authToken = token; })
    .then(() => Community.create(defaultCommunity))
    .then(() => Post.create(defaultPost))
    .then(() => Comment.create(defaultComment))
    .then(() => Comment.create(defaultReply)));

  describe('POST /users', () => {
    it('should response HTTP 201', () => request.post('/users')
      .send({
        userName: 'chris',
        password: 'aaa246',
        email: 'chirs@gmail.com',
      })
      .then(res => expect(res).to.have.status(201)));

    it('should response HTTP 409', () => request.post('/users')
      .send({ userName: 'test', password: 'aaa246' })
      .then(res => expect(res).to.have.status(422)));
  });

  /* --------------------------------- /posts --------------------------------- */
  describe('GET /posts', () => {
    it('should response HTTP 200', () => request.get('/posts')
      .query({ offset: 0, limit: 10, sort: 'new' })
      .then((res) => {
        expect(res.body).instanceof(Array);
        expect(res).to.have.status(200);
      }));
  });

  describe('GET /posts/{postId}', () => {
    it('should responde HTTP 200', () => request.get('/posts/1')
      .then((res) => {
        expect(res).to.have.status(200);
      }));

    it('should return HTTP 404', () => request.get('/posts/999')
      .then((res) => {
        expect(res).to.have.status(404);
      }));
  });

  describe('PATCH /posts/{postId}', () => {
    it('should responde HTTP 200', () => request.patch('/posts/1')
      .auth(authToken, { type: 'bearer' })
      .send({ content: 'edited' })
      .then(res => expect(res).to.have.status(200)));
  });

  describe('GET /posts/{postId}/comments', () => {
    it('should responde HTTP 200', () => request.get('/posts/1/comments')
      .then(res => expect(res).to.have.status(200)));
  });

  describe('POST /posts/{postId}/comments', () => {
    it('should responde HTTP 200', () => request.post('/posts/1/comments')
      .auth(authToken, { type: 'bearer' })
      .send({ content: 'this is a comment' })
      .then(res => expect(res).to.have.status(201)));
  });

  describe('PUT /posts/{postId}/votes', () => {
    it('should response HTTP 200', () => request.put('/posts/1/votes')
      .auth(authToken, { type: 'bearer' })
      .send({ value: 1 })
      .then((res) => {
        expect(res).to.have.status(200);
      }));
  });

  /* ------------------------------ /communities ------------------------------ */
  describe('POST /communities', () => {
    it('should response HTTP 201', () => request.post('/communities')
      .auth(authToken, { type: 'bearer' })
      .send({ communityName: 'node' })
      .then(res => expect(res).to.have.status(201)));
  });

  describe('GET /communities/{communityName}', () => {
    it('should response HTTP 200', () => request.get('/communities/testCom/posts')
      .query({ offset: 0, limit: 10, sort: 'new' })
      .then(res => expect(res).to.have.status(200)));
  });

  describe('POST /communities/{communityName}', () => {
    it('should response HTTP 201', () => request.post('/communities/testCom/posts')
      .auth(authToken, { type: 'bearer' })
      .send({ title: 'this is the title', content: 'this is the post content' })
      .then(res => expect(res).to.have.status(201)));
  });

  /* -------------------------------- /comments ------------------------------- */
  describe('GET /comments/{commentId}/replies', () => {
    it('should response HTTP 200', () => request.get('/comments/1/replies')
      .then(res => expect(res).to.have.status(200)));
  });

  describe('POST /comments/{commentId}/replies', () => {
    it('should response HTTP 201', () => request.post('/comments/1/replies')
      .auth(authToken, { type: 'bearer' })
      .send({ content: 'this is the reply' })
      .then(res => expect(res).to.have.status(201)));

    it('should response HTTP 404 when commentId not found', () => request.post('/comments/999/replies')
      .auth(authToken, { type: 'bearer' })
      .send({ content: 'this is the reply' })
      .then(res => expect(res).to.have.status(404)));
  });

  /* ------------------------------- /authTokens ------------------------------ */
  describe('POST /authTokens', () => {
    it('should response HTTP 201', () => request.post('/authTokens')
      .send({ userName: 'test', password: 'p@ssw@d' })
      .then((res) => {
        expect(res).to.have.status(201);
      }));
  });


  after('shut down application', () => {
    request.close((error) => {
      if (!error) {
        console.log('application has closed');
      }
    });
  });
});
