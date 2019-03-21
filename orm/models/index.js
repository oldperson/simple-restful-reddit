const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

/**
 * The DB instance base on Sequelize, contains:\
 * 1.The cached models to manuplate tables.\
 * 2.The cached sequelize instance.\
 * 3.The Sequelize constants and static methods.
 * @property {Sequlize} sequelize -The Cached Sequelize instance.
 * @property {SequlizeStatic} Sequelize - The constants and static methods of Sequelize.
 */
const db = {};

// set up  path of sqlite file
if (env !== 'production' && config.storage) {
  config.storage = path.join(__dirname, config.storage);
}

const sequelize = new Sequelize(config.database, config.username, config.password, config);
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// Bind models which are returned by Sequelize.define().
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
