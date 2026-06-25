const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    baseFee: { type: DataTypes.FLOAT, defaultValue: 0 },
    description: { type: DataTypes.TEXT }
  });
  return Service;
};
