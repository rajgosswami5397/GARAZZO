require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./utils/db');

(async () => {
  try {
    await db.sequelize.sync({ force: true });
    const User = db.models.User;
    const Service = db.models.Service;

    // create admin
    const adminPass = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@instamech.test', passwordHash: adminPass, role: 'admin' });

    // sample services
    const services = [
      { name: 'Engine Repair', baseFee: 1500, description: 'Engine diagnostics & repair' },
      { name: 'Tire Replacement', baseFee: 800, description: 'Flat tire replacement, tubeless repair' },
      { name: 'Battery Jumpstart', baseFee: 300, description: 'Battery jumpstart and replacement services' },
      { name: 'Emergency Towing', baseFee: 2500, description: 'Towing to nearest garage' }
    ];
    for (const s of services) await Service.create(s);

    console.log('Seed completed. Database initialized.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
