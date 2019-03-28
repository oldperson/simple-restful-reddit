module.exports = (sequelize, DataTypes) => sequelize.define('Vote', {
  postId: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Post',
      key: 'postId',
    },
  },
  userId: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId',
    },
  },
  value: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
}, {});
