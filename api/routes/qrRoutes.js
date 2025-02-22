const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController.js');

router.post('/generate', qrController.generateQR);
router.get('/analytics/:id', qrController.getAnalytics);
router.get('/history', qrController.getHistory);

module.exports = router;