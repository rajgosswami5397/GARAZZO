const { Sequelize } = require('sequelize');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL || `sqlite:${path.join(__dirname,'..','database.sqlite')}`;

// Create sequelize instance - adapts to sqlite or postgres
const sequelize = new Sequelize(DATABASE_URL, {
  logging: false
});

// Models
const UserModel = require('../models/user')(sequelize);
const ServiceModel = require('../models/service')(sequelize);
const MechanicModel = require('../models/mechanic')(sequelize);
const BookingModel = require('../models/booking')(sequelize);
const PaymentModel = require('../models/payment')(sequelize);
const ReviewModel = require('../models/review')(sequelize);
const DocumentModel = require('../models/document')(sequelize);

// Associations
UserModel.hasOne(MechanicModel, { foreignKey: 'userId' });
MechanicModel.belongsTo(UserModel, { foreignKey: 'userId' });

ServiceModel.hasMany(BookingModel, { foreignKey: 'serviceId' });
BookingModel.belongsTo(ServiceModel, { foreignKey: 'serviceId' });

UserModel.hasMany(BookingModel, { foreignKey: 'customerId', as: 'customerBookings' });
BookingModel.belongsTo(UserModel, { foreignKey: 'customerId', as: 'customer' });

MechanicModel.hasMany(BookingModel, { foreignKey: 'mechanicId' });
BookingModel.belongsTo(MechanicModel, { foreignKey: 'mechanicId' });

BookingModel.hasOne(PaymentModel, { foreignKey: 'bookingId' });

MechanicModel.hasMany(DocumentModel, { foreignKey: 'mechanicId' });

// Export
const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // { force: true } during dev if needed
  return null; 
};

module.exports = {
  sequelize,
  initDB,
  models: {
    User: UserModel,
    Service: ServiceModel,
    Mechanic: MechanicModel,
    Booking: BookingModel,
    Payment: PaymentModel,
    Review: ReviewModel,
    Document: DocumentModel
  }
};
