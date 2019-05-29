const { SchemaTypes } = require('mongoose');

module.exports = {
  // commentId: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true,
  //   allowNull: false,
  // },
  schema: {
    // The post which this comment belongs to. If record is a reply, postId would be null
    postId: {
      type: SchemaTypes.ObjectId,
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
  watch: [
    {
      name: 'change',
      listener(db, event) {
        const inserted = event.fullDocument;
        if (event.operationType === 'insert') {
          db.Post.updateOne({ _id: inserted.postId },
            { $inc: { comments: 1 } }).exec();
        }
      },
    },
  ],
};
