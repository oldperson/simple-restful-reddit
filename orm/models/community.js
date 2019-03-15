module.exports = (sequelize, DataTypes) => sequelize.define('Community', {
  communityId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  communityName: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
}, {});
