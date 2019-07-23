const { expect } = require('chai');

const { controversy, top, hot } = require('../../../lib/ranking');

describe('ranking', () => {
  describe('controversy', () => {
    it('should have have higer score if the upvotes and downvotes are close', () => {
      expect(controversy(100, 100)).to.above(controversy(100, 1));
    });

    it('should have have higer score if having more upvotes and downvotes', () => {
      expect(controversy(10000, 10000)).to.above(controversy(100, 100));
    });
  });

  describe('top', () => {
    it('should have higher score if having more upvotes without any downvotes', () => {
      expect(top(1000, 0)).above(top(10, 0));
    });

    it('should have higher score if having  less downvotes', () => {
      expect(top(1000, 0)).above(top(1000, 10));
    });
  });

  describe('hot', () => {
    it('should have higher score if newer', () => {
      expect(hot(1000, 0, new Date(2019, 10, 0)))
        .above(hot(1000, 0, new Date(2019, 9, 0)));
    });

    it('should have higher score if having more upvotes', () => {
      expect(hot(1000, 0, new Date(2019, 10, 0)))
        .above(hot(10, 0, new Date(2019, 10, 0)));
    });

    it('should have higher score if having less downvotes', () => {
      expect(hot(1000, 0, new Date(2019, 10, 0)))
        .above(hot(1000, 10, new Date(2019, 10, 0)));
    });
  });
});
