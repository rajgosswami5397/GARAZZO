const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { auth, permit } = require('../middlewares/auth');

// Admin: list unverified mechanics
router.get('/mechanics/pending', auth, permit('admin'), async (req, res) => {
  const mechs = await db.models.Mechanic.findAll({ where: { verified: false }, include: db.models.User });
  res.json(mechs);
});

// Admin: verify mechanic
router.patch('/mechanics/:id/verify', auth, permit('admin'), async (req, res) => {
  const mech = await db.models.Mechanic.findByPk(req.params.id);
  if (!mech) return res.status(404).json({ error: 'Not found' });
  mech.verified = true;
  await mech.save();
  res.json({ ok: true, mech });
});

// Admin: list bookings
router.get('/bookings', auth, permit('admin'), async (req, res) => {
  const bookings = await db.models.Booking.findAll({ include: [db.models.Service, db.models.Mechanic] });
  res.json(bookings);
});

module.exports = router;
