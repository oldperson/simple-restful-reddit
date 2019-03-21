const { expect } = require('chai');
const sinon = require('sinon');
const authorizationHandler = require('../../../middlewares/authoriztionHandler');

describe('authorizationHandler', () => {
  afterEach(() => sinon.restore());

  it('should call next() when user has authority', () => {
    // Arrange
    const req = {
      route: {},
      user: {},
    };
    const res = {
      status: sinon.spy(function () { return this; }),
      json: sinon.spy(function () { return this; }),
    };
    const next = sinon.spy();

    // Act
    authorizationHandler(req, res, next);

    // Assert
    expect(res.status.notCalled).to.be.true;
    expect(res.json.notCalled).to.be.true;
    expect(next.called).to.be.true;
  });
  it('should response 401 when no user identity', () => {
    // Arrange
    const req = {};
    const res = {
      status: sinon.spy(function () { return this; }),
      json: sinon.spy(function () { return this; }),
    };
    const next = sinon.spy();

    // Act
    authorizationHandler(req, res, next);

    // Assert
    expect(res.status.args[0][0]).to.equal(401);
    expect(res.json.args[0][0]).to.exist;
    expect(next.notCalled).to.be.true;
  });
});
