const incrementRepliesSql = 'UPDATE Comment SET replies = IFNULL(replies, 0) + 1 WHERE commentId = :parentCommentId; ';
module.exports = (sequelize, DataTypes) => sequelize.define('Comment', {
  commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Post',
      key: 'postId',
      comment: 'The post which this comment belongs to. If record is a reply, postId would be null',
    },
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId',
    },
  },
  parentCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Comment',
      key: 'commentId',
    },
    comment: 'The comment which this reply belongs to. If it is a reply, parentCommentId would be null',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  replies: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Count replies of comments, if this record is a reply or comment without any reply, this column would be null',
  },
},
{
  hooks: {
    afterCreate: (newComment) => {
      if (newComment.parentCommentId) {
        return sequelize.query(incrementRepliesSql, { replacements: newComment });
      }
      return Promise.resolve();
    },
  },
});
