const { SchemaTypes } = require('mongoose');

module.exports = {
  schema: {
    // postId: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    //   allowNull: false,
    // },
    communityId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    communityName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      maxlength: 20,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
};
