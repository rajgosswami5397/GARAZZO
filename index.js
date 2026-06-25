const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/services', require('./services'));
router.use('/mechanics', require('./mechanics'));
router.use('/bookings', require('./bookings'));
router.use('/admin', require('./admins'));
router.use('/payments', require('./payments'));

module.exports = router;


// --- IGNORE ---