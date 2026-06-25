const jwt = require('jsonwebtoken');
const { models } = require('../utils/db');

const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Authorization missing' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await require('../utils/db').models.User.findByPk(payload.id);
    if (!req.user) return res.status(401).json({ error: 'Invalid token' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Auth required' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

module.exports = { auth, permit };
// --- IGNORE ---