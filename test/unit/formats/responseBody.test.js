const { expect } = require('chai');
const { createErrorBody } = require('../../../formats/responseBody');

describe('responseBody', () => {
  describe('createErrorBody', () => {
    it('should response error body if input is an Error', () => {
      // Arrange
      const errorMessage = 'this is error';
      const error = new Error(errorMessage);

      // Act
      const result = createErrorBody(error);

      // Assert
      expect(result).eql({ message: errorMessage });
    });

    it('should response error body if input is string', () => {
      // Arrange
      const errorMessage = 'this is error';

      // Act
      const result = createErrorBody(errorMessage);

      // Assert
      expect(result).eql({ message: errorMessage });
    });

    it('should throw TypeError if input is not string or Error', () => {
      expect(() => {
        createErrorBody({});
      }).to.throw(TypeError);
    });
  });
});
