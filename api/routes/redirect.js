// routes/redirect.js
const express = require('express');
const router = express.Router();
const supabase = require('../util/database.js');

router.get('/:id', async (req, res) => {
  try {
    // Get target URL from Supabase
    const { data, error } = await supabase
      .from('qr_codes')
      .select('target_url')
      .eq('id', req.params.id)
      .single();
    
    if (error || !data) {
      return res.status(404).send('QR code not found');
    }
    
    // Log analytics
    await supabase.from('analytics').insert([{
      qr_code_id: req.params.id,
      ip_address: req.ip,
      timestamp: new Date(),
      user_agent: req.headers['user-agent']
    }]);
    
    // Redirect to target URL
    res.redirect(data.target_url);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;