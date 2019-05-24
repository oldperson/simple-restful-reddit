const { SchemaTypes } = require('mongoose');

module.exports = {
  // commentId: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true,
  //   allowNull: false,
  // },
  schema: {
    postId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    authorId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    // 'The comment which this reply belongs to. If it is a reply, parentCommentId would be null'
    parentCommentId: {
      type: SchemaTypes.ObjectId,
    },
    content: {
      type: String,
      required: true,
    },
  },
};
