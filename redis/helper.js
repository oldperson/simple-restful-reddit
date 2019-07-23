const { hot, top, controversy } = require('../lib/ranking');
const key = require('./key');

function updatePostRanking(batch, postId, communityName, ups, downs, createdAt) {
  batch.zadd(key.postsSortedByNew, createdAt.getTime(), postId)
    .zadd(key.postsSortedByControversial, controversy(ups, downs), postId)
    .zadd(key.postsSortedByTop, top(ups, downs), postId)
    .zadd(key.postsSortedByHot, hot(ups, downs, createdAt), postId)
    .zadd(key.postsOfCommunitySortBy(communityName, 'new'), createdAt.getTime(), postId)
    .zadd(key.postsOfCommunitySortBy(communityName, 'controversial'), controversy(ups, downs), postId)
    .zadd(key.postsOfCommunitySortBy(communityName, 'top'), top(ups, downs), postId)
    .zadd(key.postsOfCommunitySortBy(communityName, 'hot'), hot(ups, downs, createdAt), postId);
}
exports.updatePostRanking = updatePostRanking;
