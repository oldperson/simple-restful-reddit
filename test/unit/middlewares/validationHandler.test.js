const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const testedPath = '../../../middlewares/valiationHandler';
describe('validationHandler', () => {
  after(() => sinon.restore());
  describe('validate', () => {
    it('should work', () => {
      // Arrange
      const validationHandler = 'Expected Handler';
      const validation = proxyquire(testedPath, {
        'express-validator/check': {
          checkSchema: sinon.stub().returns([validationHandler]),
        },
      });

      // Act
      const handlers = validation.validate({}, {});

      // Assert
      expect(handlers).with.length(3);
      expect(handlers[0]).to.equal(validationHandler);
      expect(handlers[1]).to.equal(validationHandler);
      expect(handlers[2]).to.eql(validation.validationErrorHandler);
    });
  });

  describe('validationErrorHandler', () => {
    it('should pass request to next handler when validation pass', () => {
      // Arrange
      const req = {};
      const res = {
        status: sinon.spy(function () { return this; }),
        json: sinon.spy(function () { }),
      };
      const next = sinon.spy();
      const { validationErrorHandler } = proxyquire(testedPath, {
        'express-validator/check': {
          validationResult: sinon.stub().returns({
            isEmpty: sinon.stub().returns(true),
          }),
        },
      });

      // Act
      validationErrorHandler(req, res, next);

      // Expect
      expect(next.called).to.be.true;
      expect(res.status.notCalled).to.be.true;
      expect(res.json.notCalled).to.be.true;
    });

    it('should response HTTP 422 when validation fail', () => {
      // Arrange
      const req = {};
      const res = {
        status: sinon.spy(function () { return this; }),
        json: sinon.spy(function () { }),
      };
      const next = sinon.spy();
      const details = {};
      const { validationErrorHandler } = proxyquire(testedPath, {
        'express-validator/check': {
          validationResult: sinon.stub().returns({
            isEmpty: sinon.stub().returns(false),
            array: sinon.stub().returns(details),
          }),
        },
      });

      // Act
      validationErrorHandler(req, res, next);

      // Expect
      expect(next.notCalled).to.be.true;
      expect(res.status.args[0][0]).to.equal(422);
      expect(res.json.args[0][0].details).to.eql(details);
    });
  });
});
