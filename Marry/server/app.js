const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const weddingRoutes = require('./routes/wedding');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Thiệp Cưới Online - QR Code Wedding Card'
  });
});

app.use('/', weddingRoutes);

// Admin Dashboard (optional for managing wedding details)
app.get('/admin', (req, res) => {
  res.render('admin', {
    title: 'Admin Dashboard'
  });
});

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    message: 'Something went wrong!'
  });
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`\n╔════════════════════════════════════╗`);
  console.log(`║  Marry - QR Wedding Card App       ║`);
  console.log(`╠════════════════════════════════════╣`);
  console.log(`║  Server is running at:             ║`);
  console.log(`║  🌐 http://${HOST}:${PORT}${ ' '.repeat(20 - HOST.length - PORT.toString().length)}║`);
  console.log(`╚════════════════════════════════════╝\n`);
});

module.exports = app;
