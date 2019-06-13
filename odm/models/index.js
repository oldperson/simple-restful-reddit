/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;
const basename = path.basename(__filename);
/**
 * db.ModelName to get the mongoose model.
 * db.mongoose to get the mongoose instance.
 */
const db = {};
const connectionOptions = {
  // to stop the deprecation warnings from mogodb driver
  // https://mongoosejs.com/docs/deprecations.html
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
const generalSchemaOptions = {
  id: false, // disable virtual model.id
  timestamps: true, // add createAt, updatedAt
  toJSON: {
    virtuals: true, // add virtual fields in JSON
    transform: (doc, ret) => {
      delete ret._id; 
      delete ret.__v;
      return ret;
    },
  },
};

if (_.isEmpty(process.env.REDDIT_MONGODB_CONNECTION)) {
  throw new Error('Evroinment variable { REDDIT_MONGODB_CONNECTION } sould not be empty');
}
mongoose.connect(process.env.REDDIT_MONGODB_CONNECTION, connectionOptions);

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((fileName) => {
    const modelPath = path.join(__dirname, fileName);
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const model = require(modelPath);
    const modelName = _.upperFirst(fileName.split('.')[0]);
    const modelSchema = new Schema(model.schema, generalSchemaOptions);
    const indexes = model.indexes || [];

    // add setter and getter for _id, make model.modelId accessable
    const modelId = `${_.lowerFirst(modelName)}Id`;
    modelSchema.virtual(modelId)
      .get(function () { return this._id; })
      .set(function (id) { this._id = id; });

    // set up indexes, models, statics
    indexes.forEach((index) => {
      modelSchema.index(index.fields, index.options);
    });
    modelSchema.methods = model.methods || {};
    modelSchema.statics = model.statics || {};

    // build mongoose model
    db[modelName] = mongoose.model(modelName, modelSchema);

    // register change stream
    const watchPipeline = [];
    const watchOptions = { fullDocument: 'updateLookup' };
    model.watch = model.watch || [];
    model.watch.forEach((event) => {
      db[modelName].watch(watchPipeline, watchOptions)
        .on(event.name, event.listener.bind(null, db));
    });
  });
db.mongoose = mongoose;
module.exports = db;
