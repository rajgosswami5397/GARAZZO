const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { auth, permit } = require('../middlewares/auth');
const db = require('../utils/db');

// Mechanic registers/updates profile
router.post('/register', auth, async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'mechanic') return res.status(403).json({ error: 'Only mechanics' });
    const { skills, experienceYears, location } = req.body;
    const mech = await db.models.Mechanic.findOne({ where: { userId: user.id } });
    if (mech) {
      mech.skills = skills || mech.skills;
      mech.experienceYears = experienceYears || mech.experienceYears;
      mech.location = location || mech.location;
      await mech.save();
      return res.json(mech);
    } else {
      const created = await db.models.Mechanic.create({
        userId: user.id, skills, experienceYears, location
      });
      return res.json(created);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload documents (KYC)
router.post('/upload-doc', auth, upload.single('document'), async (req, res) => {
  const user = req.user;
  if (user.role !== 'mechanic') return res.status(403).json({ error: 'Only mechanics' });
  const mech = await db.models.Mechanic.findOne({ where: { userId: user.id } });
  if (!mech) return res.status(404).json({ error: 'Mechanic profile not found' });
  const doc = await db.models.Document.create({
    mechanicId: mech.id,
    type: req.body.type || 'id',
    url: req.file.path
  });
  res.json({ ok: true, doc });
});

// List nearby mechanics (simple location filter; replace with geolocation query later)
router.get('/nearby', async (req, res) => {
  const { service, location } = req.query;
  // For MVP: return verified mechanics
  const mechanics = await db.models.Mechanic.findAll({ where: { verified: true } , include: db.models.User});
  res.json(mechanics);
});

// Mechanic toggle online/offline
router.patch('/availability', auth, async (req, res) => {
  if (req.user.role !== 'mechanic') return res.status(403).json({ error: 'Only mechanics' });
  const { online } = req.body;
  const mech = await db.models.Mechanic.findOne({ where: { userId: req.user.id } });
  if (!mech) return res.status(404).json({ error: 'No mechanic profile' });
  mech.online = !!online;
  await mech.save();
  res.json(mech);
});

module.exports = router;
