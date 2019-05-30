const sinon = require('sinon');
const { expect } = require('chai');
const { ObjectId } = require('mongoose').Types;
const objectIdWrapper = require('../../../middlewares/objectIdWrapper');

describe('objectIdWrapper', () => {
  it('should wrap id to objectId ', () => {
    // Arrange
    const req = {
      params: {
        _id: '5cee8de65d9fd4f5ae5b1ff1',
        postId: '5cee8f51beef1a252c77c794',
        title: 'will not be wrapped',
      },
    };
    const res = sinon.spy();
    const next = sinon.spy();

    // Act
    objectIdWrapper(req, res, next);

    // Assert
    // eslint-disable-next-line no-underscore-dangle
    expect(req.params._id.equals(ObjectId('5cee8de65d9fd4f5ae5b1ff1'))).to.be.true;
    expect(req.params.postId.equals(ObjectId('5cee8f51beef1a252c77c794'))).to.be.true;
    expect(req.params.title).equal('will not be wrapped');
    expect(res.notCalled);
    expect(next.called);
  });
});
