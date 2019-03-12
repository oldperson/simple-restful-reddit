const { expect } = require('chai');
const sinon = require('sinon');
const errorHandler = require('../../../middlewares/errorHandler');

describe('errorHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('errorHandler', () => {
    it('should reponse "Internal Server Error" in production environment', () => {
      // Arange
      const err = new Error('This should not be seen by client');
      const req = {};
      const res = {
        status: sinon.spy(function () { return this; }),
        json: sinon.spy(function () { return this; }),
      };
      const next = sinon.spy();

      // Act
      errorHandler('production')(err, req, res, next);

      // Assert
      expect(res.status.args[0][0]).equal(500);
      expect(res.json.args[0][0]).to.eql({ message: 'Internal Server Error' });
      expect(next.notCalled).to.be.true;
    });

    it('should call next(err) when not in production environment', () => {
      // Arrange
      const err = new Error('This should not be seen by client');
      const req = {};
      const res = {
        status: sinon.spy(function () { return this; }),
        json: sinon.spy(function () { return this; }),
      };
      const next = sinon.spy();

      // Act
      errorHandler('test')(err, req, res, next);

      // Assert
      expect(res.status.notCalled).to.be.true;
      expect(res.json.notCalled).to.be.true;
      expect(next.args[0][0]).to.equals(err);
    });
  });
});
