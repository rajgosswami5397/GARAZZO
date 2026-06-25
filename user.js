const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: true },
    phone: { type: DataTypes.STRING, unique: true, allowNull: true },
    passwordHash: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('customer','mechanic','admin'), defaultValue: 'customer' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return User;
};
