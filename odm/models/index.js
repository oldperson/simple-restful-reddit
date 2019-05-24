const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const _ = require('lodash');

const basename = path.basename(__filename);
/**
 * db.ModelName to get the mongoose model.
 * db.mongoose to get the mongoose instance.
 */
const db = {};
const { Schema } = mongoose;

if (_.isEmpty(process.env.REDDIT_MONGODB_CONNECTION)) {
  throw new Error('Evroinment variable { REDDIT_MONGODB_CONNECTION } sould not be empty');
}
mongoose.connect(process.env.REDDIT_MONGODB_CONNECTION);

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((fileName) => {
    const modelPath = path.join(__dirname, fileName);
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const model = require(modelPath);
    const modelName = _.upperFirst(fileName.split('.')[0]);
    const modelSchema = new Schema(model.schema);
    const indexes = model.indexes || [];

    indexes.forEach((index) => {
      modelSchema.index(index.fields, index.options);
    });
    modelSchema.methods = model.methods || {};
    modelSchema.statics = model.statics || {};
    db[modelName] = mongoose.model(modelName, modelSchema);
  });
db.mongoose = mongoose;
module.exports = db;
