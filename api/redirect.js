const express = require('express');
const cors = require('cors');
const supabase = require('../util/database.js'); // Move these files into the api directory

const app = express();
app.use(cors());
app.use(express.json());

app.all('*', async (req, res) => {
  // Extract tracking ID from URL
  const trackingId = req.url.split('/r/')[1];
  
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
    res.redirect(data.target_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Server error');
  }
});

module.exports = app;