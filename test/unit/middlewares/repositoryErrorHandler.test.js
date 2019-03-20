const sinon = require('sinon');
const { expect } = require('chai');
const { repositoryErrorHandler } = require('../../../middlewares/repositoryErrorHandler');
const { ValueAlreadyExistsError } = require('../../../repositories/errors');

describe('repositoryErrorHandler', () => {
  it('should response HTTP 409 when handle ValueAlreadyExistsError', () => {
    // Arrange
    const err = new ValueAlreadyExistsError('userName', 'kevin');
    const req = {};
    const res = {
      status: sinon.spy(function () { return this; }),
      json: sinon.spy(function () { return this; }),
    };
    const next = sinon.spy();

    // Act
    repositoryErrorHandler(err, req, res, next);

    // Assert
    expect(res.status.args[0][0]).to.equal(409);
    expect(res.json.args[0][0]).to.exist;
    expect(next.notCalled).to.be.true;
  });

  it('should call next(error) when handle non-repository error', () => {
    // Arrange
    const err = new Error();
    const req = {};
    const res = {
      status: sinon.spy(function () { return this; }),
      json: sinon.spy(function () { return this; }),
    };
    const next = sinon.spy();

    // Act
    repositoryErrorHandler(err, req, res, next);

    // Assert
    expect(res.status.notCalled).to.be.true;
    expect(res.json.notCalled).to.be.true;
    expect(next.args[0][0]).to.eql(err);
  });
});
