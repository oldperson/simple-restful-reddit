/* eslint-disable no-underscore-dangle */
const sinon = require('sinon');
const { expect } = require('chai');
const { ObjectId } = require('mongoose').Types;
const objectIdWrapper = require('../../../middlewares/objectIdWrapper');

describe('objectIdWrapper', () => {
  it('should wrap id of path parameters to objectId ', () => {
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
    expect(req.params._id.equals(ObjectId('5cee8de65d9fd4f5ae5b1ff1'))).to.be.true;
    expect(req.params.postId.equals(ObjectId('5cee8f51beef1a252c77c794'))).to.be.true;
    expect(req.params.title).equal('will not be wrapped');
    expect(res.notCalled);
    expect(next.called);
  });

  it('should wrap id of body to objectId object', () => {
    // Arrage
    const req = {
      body: {
        postId: '5cf0d2e13b1b1cf6ae795eee',
        _id: '5cf0d3817803665df712dd6e',
        title: 'will not be wrapped',
      },
    };
    const res = sinon.spy();
    const next = sinon.spy();

    // Act
    objectIdWrapper(req, res, next);

    // Assert
    expect(req.body.postId.equals(ObjectId('5cf0d2e13b1b1cf6ae795eee'))).to.be.true;
    expect(req.body._id.equals(ObjectId('5cf0d3817803665df712dd6e'))).to.be.true;
    expect(req.body.title).to.equal('will not be wrapped');
    expect(res.notCalled).to.be.true;
    expect(next.called).to.be.true;
  });
});
