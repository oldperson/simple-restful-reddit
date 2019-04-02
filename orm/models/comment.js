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
}, {});
