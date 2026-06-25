const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Document = sequelize.define('Document', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    mechanicId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
    verifiedAt: { type: DataTypes.DATE, allowNull: true }
  });
  return Document;
};
