const { SchemaTypes } = require('mongoose');

module.exports = {
  schema: {
    postId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    userId: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    value: {
      type: Number,
      max: 1,
      min: -1,
      required: true,
    },
  },
  methods: {

  },
  statics: {

  },
  indexes: [
    {
      fields: { // query postId, postId-userId as index
        postId: 1, // order by asc
        userId: 1, // order by asc
      },
      options: {
        unique: true,
      },
    },
  ],
  watch: [
    {
      name: 'change',
      listener(db, event) {
        const doc = event.fullDocument;
        if (event.operationType === 'insert') {
          db.Post.updateOne({ _id: doc.postId }, { $inc: { votes: doc.value } }).exec();
        }
        // TODO: if event.operationType === 'update', sync the vote value to Post.votes
      },
    },
  ],
};
