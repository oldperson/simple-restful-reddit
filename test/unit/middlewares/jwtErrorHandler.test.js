const { expect } = require('chai');
const sinon = require('sinon');
const { UnauthorizedError } = require('express-jwt');
const jwtErrorHandler = require('../../../middlewares/jwtErrorHandler');

describe('jwtErrorHandler', () => {
  afterEach('restore all fakes', () => {
    sinon.restore();
  });

  const unauthorizedCodes = [
    'invalid_token',
    'credentials_bad_scheme',
    'credentials_bad_format',
  ];

  unauthorizedCodes.forEach((code) => {
    it(`should response HTTP 401 when occur authentication error: ${code}`, () => {
      // Arrage
      const message = 'authentication fail';
      const err = new UnauthorizedError(code, { message });
      const res = {
        status: sinon.spy(function () { return this; }),
        json: sinon.spy(function () { return this; }),
      };
      const req = {};
      const next = sinon.spy();

      // Act
      jwtErrorHandler(err, req, res, next);

      // Assert
      const expectedMessage = `Token authentication fail. [${code}] ${message}`;
      expect(res.status.args[0][0]).to.equal(401);
      expect(res.json.args[0][0]).to.eql({ message: expectedMessage });
      expect(next.notCalled).to.be.true;
    });
  });


  it('should pass error to next handler when is not authentication error', () => {
    // Arrage
    const err = new Error();
    const res = {
      status: sinon.spy(function () { return this; }),
      json: sinon.spy(function () { return this; }),
    };
    const req = {};
    const next = sinon.spy();

    // Act
    jwtErrorHandler(err, req, res, next);

    // Assert
    expect(res.status.notCalled).to.be.true;
    expect(res.json.notCalled).to.be.true;
    expect(next.args[0][0]).to.eql(err);
  });
});
