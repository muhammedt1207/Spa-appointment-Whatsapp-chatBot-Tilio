const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const appointmentRoutes = require('./routes/appointmentRoutes');
const whatsappRoutes = require('./routes/WhatsappRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/whatsapp', whatsappRoutes);

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down');
  process.exit(0);
});

module.exports = app;