# Simple restful Reddit [![Build Status](https://travis-ci.com/oldperson/simple-restful-reddit.svg?branch=mysql)](https://travis-ci.com/oldperson/simple-restful-reddit)
A web application provides a set of APIs mock functionalities of [Reddit](https://www.reddit.com/).

## Try It Out
* API endpoint https://simplerestfulreddit.ddns.net/v1/
* API doc https://app.swaggerhub.com/apis-docs/oldperson/simple_restful_reddit/1.0.0
 * Create user <br/><br/>![Create user](/doc/img/swaggerUI_create_user.png)
 * Get auth token <br/><br/>![Create user](/doc/img/swaggerUI_create_auth_token.png)
 * Athentication/Authorization with auth token 
   <br/><br/>![Create user](/doc/img/swaggerUI_auth1.png)
   <br/><br/>![Create user](/doc/img/swaggerUI_auth2.png)
 * Create a community <br/><br/>![Create user](/doc/img/swaggerUI_create_community.png)

## The Ranking System
* Ranking posts by
  - Top: The posts having more upvotes and fewer downvotes than other posts.
  - Hot: The posts are newer and have more upvotes with fewer downvotes than other posts.
  - Controversial: The posts having similar upvotes and downvotes, and more votes than other posts.
  - New: The posts posted more recently than other posts.
* Cache ranking lists in redis to increase performance.

## Build With
* [Node.js](http://nodejs.org/)
* [MySQL](https://www.mysql.com/)
* [Redis](https://redis.io/)
* [Express](http://expressjs.com/)
* [Sequelize](http://docs.sequelizejs.com/)
* [AWS](https://aws.amazon.com/tw/)

## Folder Structure
```
.
├── api-spec  # OpenAPI specification
├── cache  # Wrap details of cache operations of redis
├── formats  # Format HTTP request and response
├── lib # Independent modules dealing with specific logic
├── middlewares  # Middlewares of Express.js, handle application-wide HTTP request and response 
├── orm  # Set-ups of Sequelize.js, deal with databases manipulation
│   ├── config
│   └── models
├── redis  # Set-ups of redis client and modules related to redis operations
├── repositories  # On the top of ORMs, wrap details of data manipulation
├── routers  # Routers of Express.js, handle api-specific HTTP request and response
├── test
│   ├── integretion
│   └── unit
├── validation  # Contains schemas to validate HTTP requests
└── app.js  # Entry point of the application 
```

## Unit/Integration Test With
* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)
* [Sinon](https://sinonjs.org/releases/v7.2.7/)

## Run test
```
npm test
```