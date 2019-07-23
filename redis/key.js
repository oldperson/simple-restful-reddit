const isSort = {
  new: true,
  top: true,
  hot: true,
  controversial: true,
};

function downvotesOfPost(postId) {
  return `posts/${postId}/downs/users`;
}
module.exports.downvotesOfPost = downvotesOfPost;

function upvotesOfPost(postId) {
  return `posts/${postId}/ups/users`;
}
module.exports.upvotesOfPost = upvotesOfPost;

function postsOfCommunitySortBy(communityName, sort) {
  if (!isSort[sort]) {
    throw new Error(`sort by ${sort} is not supported`);
  }

  return `community/${communityName}/posts?sort=${sort}`;
}
module.exports.postsOfCommunitySortBy = postsOfCommunitySortBy;

function postsSortBy(sort) {
  if (!isSort[sort]) {
    throw new Error(`sort by ${sort} is not supported`);
  }

  return `posts?sort=${sort}`;
}
module.exports.postsSortBy = postsSortBy;

function postOfposts(postId) {
  return `posts/${postId}`;
}
module.exports.postOfposts = postOfposts;

module.exports.postsSortedByNew = 'posts?sort=new';
module.exports.postsSortedByTop = 'posts?sort=top';
module.exports.postsSortedByHot = 'posts?sort=hot';
module.exports.postsSortedByControversial = 'posts?sort=controversial';
