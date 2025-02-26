const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const supabase = require('../util/database.js')
const qrRoutes = require('../api/routes/qrRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/qr', qrRoutes);
// Production setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Export the app for serverless use
module.exports = app;