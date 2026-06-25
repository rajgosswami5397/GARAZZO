const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Create payment order (placeholder)
router.post('/create-order', async (req, res) => {
  // In production integrate Razorpay/Stripe SDK to create an order and return order details
  // Here we return a stub
  const { bookingId, amount } = req.body;
  // Save stub payment entry
  const payment = await db.models.Payment.create({
    bookingId,
    provider: process.env.PAYMENT_PROVIDER || 'razorpay',
    providerPaymentId: `stub-${Date.now()}`,
    status: 'created',
    amount
  });
  res.json({ ok: true, payment });
});

// Webhook to capture payment (Razorpay/Stripe will call this)
router.post('/webhook', express.json({ type: '*/*' }), async (req, res) => {
  // Validate webhook signature in real implementation
  const { bookingId, providerPaymentId, status } = req.body;
  const payment = await db.models.Payment.findOne({ where: { providerPaymentId } });
  if (payment) {
    payment.status = status || 'paid';
    await payment.save();
    // mark booking paid
    const booking = await db.models.Booking.findByPk(payment.bookingId);
    if (booking) {
      booking.paid = true;
      await booking.save();
    }
  }
  res.json({ ok: true });
});

module.exports = router;
