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

let sequelize = new Sequelize(config.database, config.username, config.password, config);
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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

/**
 * Shutdown the foreign key checks when truncate table,
 * after table truncated, restore the foreign key checks.
 * @returns {Promise}
 */
function truncateIgnoreFK() {
  if (this.sequelize.getDialect() === 'mysql') {
    const tableName = this.getTableName().tableName || this.getTableName();
    const sql = `SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE ${tableName}; SET FOREIGN_KEY_CHECKS = 1;`;
    return this.sequelize.query(sql);
  }
  return this.truncate();
}
// append truncateIgnoreFK()
Object.keys(db).forEach((modelName) => {
  db[modelName].truncateIgnoreFK = truncateIgnoreFK;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
