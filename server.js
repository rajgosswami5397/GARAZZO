require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./utils/db');
const routes = require('./routes');
const { initSocket } = require('./utils/socket');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Attach routes
app.use('/api', routes);

// Health
app.get('/', (req, res) => res.json({ ok: true, message: 'Insta Mechanic API' }));

// Initialize DB and start server
initDB().then((server) => {
  const http = server || require('http').createServer(app);
  const io = require('socket.io')(http, { cors: { origin: '*' } });
  initSocket(io);
  http.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to initialize DB:', err);
  process.exit(1);
});
