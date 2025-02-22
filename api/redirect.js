const express = require('express');
const cors = require('cors');
const supabase = require('../util/database.js');

const app = express();
app.use(cors());
app.use(express.json());

// Simple redirect handler - no path resolution needed
const handler = async (req, res) => {
  // Get tracking ID from the URL path
  const trackingId = req.url.split('/r/')[1];
  console.log(trackingId);
  if (!trackingId) {
    return res.status(404).send('Invalid tracking ID');
  }

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
    return res.redirect(data.target_url);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).send('Server error');
  }
};

// Mount the handler
app.get('*', handler);

module.exports = app;