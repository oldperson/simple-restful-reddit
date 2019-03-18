module.exports = (sequelize, DataTypes) => sequelize.define('Post', {
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  communityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Community',
      key: 'communityId',
    },
  },
  title: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId',
    },
  },
}, {});
