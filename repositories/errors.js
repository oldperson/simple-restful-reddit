
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

class ValueAlreadyExistsError extends Error {
  constructor(field, value) {
    super(`${field}: '${value}' already exists`);
    this.name = 'ValueAlreadyExistsError';
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.ValueAlreadyExistsError = ValueAlreadyExistsError;


class IdentityNotFoundError extends Error {
  /**
   * Create IdentityNotFoundError.
   * @param {object} identities identityName: identityValue pairs
   */
  constructor(identities) {
    let message;
    if (identities) {
      message = `${Object.entries(identities)
        .reduce((pre, cur) => {
          pre.push(`'${cur[0]}:${cur[1]}'`);
          return pre;
        }, [])
        .join(' or ')} is not found`;
    }
    super(message || 'reference of entity is not found');
    this.name = 'IdentityNotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.IdentityNotFoundError = IdentityNotFoundError;

class EntityNotFoundError extends Error {
  constructor() {
    super('the entity is not found');
    this.name = 'EntityNotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports.EntityNotFoundError = EntityNotFoundError;

/**
 * Return true if the error is ForeignKeyError,
 * else return false.
 * @param {Error} error
 * @returns {boolean}
 */
function isForeignKeyError(error) {
  return (error.name === 'SequelizeForeignKeyConstraintError')
  || (error.original && error.original.code === 'ER_NO_REFERENCED_ROW'); // deal with mysql Fk error
}
module.exports.isForeignKeyError = isForeignKeyError;
