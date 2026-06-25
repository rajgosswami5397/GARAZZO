const express = require('express');
const router = express.Router();
const { models } = require('../utils/db');
const Service = require('../utils/db').models.Service;

// Get all services
router.get('/', async (req, res) => {
  const services = await require('../utils/db').models.Service.findAll();
  res.json(services);
});

// Admin: create service
router.post('/', async (req, res) => {
  const { name, baseFee, description } = req.body;
  const s = await require('../utils/db').models.Service.create({ name, baseFee, description });
  res.json(s);
});

module.exports = router;

