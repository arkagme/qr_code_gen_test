const supabase = require('../../util/database.js');
const crypto = require('crypto');

exports.generateQR = async (req, res) => {
  try {
    const { url, isDynamic, withLogo } = req.body;
    
    if (!isDynamic) {
      return res.json({ 
        url,
        isDynamic: false,
        trackingId: null
      });
    }
    
    // Generate unique tracking ID
    const trackingId = crypto.randomBytes(8).toString('hex');
    
    // Store in Supabase
    const { error } = await supabase
      .from('qr_codes')
      .insert([{ 
        id: trackingId, 
        target_url: url, 
        with_logo: withLogo,
        created_at: new Date()
      }]);
    
    if (error) throw error;
    
    // Create tracking URL
    const baseUrl = process.env.BASE_URL ||`${req.protocol}://${req.get('host')}`;
    const trackingUrl = `${baseUrl}/r/${trackingId}`;
    
    res.json({
      url: trackingUrl,
      isDynamic: true,
      trackingId
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get basic QR code info
    const { data: qrInfo, error: qrError } = await supabase
      .from('qr_codes')
      .select('id, target_url, created_at, with_logo')
      .eq('id', id)
      .single();
    
    if (qrError || !qrInfo) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    
    // Get analytics data from Supabase
    const { data: analyticsData, error: analyticsError } = await supabase.rpc(
      'get_qr_analytics', 
      { qr_id: id }
    );
    
    if (analyticsError) throw analyticsError;
    
    // Get daily scans using direct query
    const { data: dailyScans, error: dailyError } = await supabase.rpc(
      'get_daily_scans',
      { qr_id: id }
    );
    
    if (dailyError) throw dailyError;
    
    res.json({
      qr: qrInfo,
      stats: analyticsData,
      dailyScans: dailyScans
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

exports.getHistory = async (req, res) =>{
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching QR history:', error);
    res.status(500).json({ error: 'Failed to fetch QR history' });
  }
}