// app.js (new file)
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const qrRoutes = require('./api/routes/qrRoutes');
const supabase = require('./util/database'); // Pre-import for optimization
// Create Express app
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

// Redirect handler for QR code tracking
app.get('/r/:trackingId', async (req, res) => {
  const { trackingId } = req.params;
  
  try {
    // Get target URL
    const { data, error } = await supabase
      .from('qr_codes')
      .select('target_url')
      .eq('id', trackingId)
      .single();
    
    if (error || !data) {
      return res.status(404).send('QR code not found');
    }
    
    // Log this visit
    await supabase
      .from('analytics')
      .insert([{
        qr_code_id: trackingId,
        user_agent: req.headers['user-agent'],
        ip_address: req.ip
      }]);
    
    // Redirect to the target URL
    res.redirect(data.target_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Server error');
  }
});

// Export the app for serverless use
module.exports = app;