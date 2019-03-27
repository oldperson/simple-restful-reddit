// common validators
const body = 'body';
const query = 'query';
const not = true;
const isEmpty = { ignore_whitespace: true, errorMessage: 'should not be empty' };
const optional = true;
const exists = { errorMessage: 'required' };
const isEmail = {
  errrorMessage: 'invalid email',
};

const queryOptions = {
  offset: {
    in: query,
    optional,
    isInt: {
      errorMessage: 'should be an integer',
    },
  },
  limit: {
    in: query,
    optional,
    isInt: {
      options: { max: 30 },
      errorMessage: 'should be an integer',
    },
  },
  sort: {
    in: query,
    optional,
    isIn: {
      errorMessage: 'should be one of [ best, hot, top, new, rising, controversial ]',
      options: ['best', 'hot', 'top', 'new', 'rising', 'controversial'],
    },
  },
};
module.exports.queryOptions = queryOptions;

const newUser = {
  userName: {
    in: body,
    exists,
    not,
    isEmpty,
  },
  email: {
    in: body,
    exists,
    isEmail,
  },
  password: {
    in: body,
    exists,
    isAlphanumeric: {
      errorMessage: 'should only contains letters and numbers',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'should not shorter than 6',
    },
  },
};
module.exports.newUser = newUser;

const newCommunity = {
  communityName: {
    in: body,
    exists,
    not,
    isEmpty,
  },
};
module.exports.newCommunity = newCommunity;

const newPost = {
  title: {
    in: body,
    exists,
    not,
    isEmpty,
  },
  content: {
    in: body,
    exists,
    not,
    isEmpty,
  },
};
module.exports.newPost = newPost;

const newAuthToken = {
  userName: {
    in: body,
    exists,
    not,
    isEmpty,
  },
  password: {
    in: body,
    exists,
    not,
    isEmpty,
  },
};
module.exports.newAuthToken = newAuthToken;
