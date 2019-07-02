const { expect } = require('chai');

describe('what happend on travis ci if test fail ', () => {
  it('shouil fail', () => {
    expect(false).to.be.true;
  });
});
