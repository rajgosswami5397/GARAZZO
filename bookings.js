const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { auth } = require('../middlewares/auth');
const { v4: uuidv4 } = require('uuid');

// Create booking (customer)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Only customers can create bookings' });
    const { serviceId, description, address, lat, lng, estimateAmount } = req.body;
    const booking = await db.models.Booking.create({
      customerId: req.user.id,
      serviceId,
      description,
      address,
      lat,
      lng,
      estimateAmount: estimateAmount || 0,
      finalAmount: estimateAmount || 0
    });
    // Notify via sockets (booking:new)
    const io = require('../utils/socket').getIO();
    if (io) io.emit('booking:new', booking);
    res.json({ ok: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get booking
router.get('/:id', auth, async (req, res) => {
  const b = await db.models.Booking.findByPk(req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  res.json(b);
});

// Mechanic accepts booking (assign)
router.patch('/:id/accept', auth, async (req, res) => {
  if (req.user.role !== 'mechanic') return res.status(403).json({ error: 'Mechanic only' });
  const booking = await db.models.Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  const mech = await db.models.Mechanic.findOne({ where: { userId: req.user.id } });
  booking.mechanicId = mech.id;
  booking.status = 'accepted';
  await booking.save();
  // socket update
  const io = require('../utils/socket').getIO();
  if (io) io.emit('booking:update', booking);
  res.json(booking);
});

// Update booking status (mechanic/admin)
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const booking = await db.models.Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  // role checks can be detailed (mechanic only allowed transitions etc.)
  booking.status = status;
  await booking.save();
  const io = require('../utils/socket').getIO();
  if (io) io.emit('booking:update', booking);
  res.json(booking);
});

module.exports = router;
