
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
  }, {});
  // User.associate = function (models) {
  //   // associations can be defined here
  // };
  return User;
};
