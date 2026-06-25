const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    
    // Auth relations (these get added by associations, but we define them explicitly if needed, or let sequelize do it)
    // Actually, utils/db.js defines associations, which will automatically create customerId, serviceId, mechanicId.

    // Frontend fields
    vehicleInfo: { type: DataTypes.STRING },
    serviceType: { type: DataTypes.STRING },
    problemDescription: { type: DataTypes.TEXT },
    urgency: { type: DataTypes.STRING },
    location: { type: DataTypes.TEXT },
    requestedDate: { type: DataTypes.STRING },
    requestedTime: { type: DataTypes.STRING },
    
    // Backend router fields
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.TEXT },
    lat: { type: DataTypes.FLOAT },
    lng: { type: DataTypes.FLOAT },
    estimateAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    finalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },

    status: { 
      type: DataTypes.ENUM('pending', 'accepted', 'in-progress', 'completed', 'cancelled'), 
      defaultValue: 'pending' 
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return Booking;
};
