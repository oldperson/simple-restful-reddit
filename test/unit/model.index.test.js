
// dependencies
const { expect } = require('chai');
const models = require('../../orm/models/index');

// tests
describe('models', () => {
  it('Returns User model', () => {
    expect(models.User).to.be.ok;
  });
});
