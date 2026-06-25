const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Mechanic = sequelize.define('Mechanic', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    skills: { type: DataTypes.TEXT }, // JSON string or comma-separated
    experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 },
    location: { type: DataTypes.STRING },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    online: { type: DataTypes.BOOLEAN, defaultValue: false },
    ratingAvg: { type: DataTypes.FLOAT, defaultValue: 0 }
  });
  return Mechanic;
};
