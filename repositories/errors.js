
class UserNotFoundError extends Error {
  constructor() {
    super('User is not found');
    this.name = 'UserNotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.UserNotFoundError = UserNotFoundError;

class IncorrectPasswordError extends Error {
  constructor() {
    super('Password is incorrect');
    this.name = 'IncorrectPasswordError';
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.IncorrectPasswordError = IncorrectPasswordError;

class UserNameAlreadyExistsError extends Error {
  constructor(userName) {
    super(`'${userName}' already exists`);
    this.name = 'UserNameAlreadyExistsError';
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.UserNameAlreadyExistsError = UserNameAlreadyExistsError;
