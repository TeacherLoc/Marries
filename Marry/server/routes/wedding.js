const express = require('express');
const router = express.Router();
const WeddingController = require('../controllers/WeddingController');

// Wedding Card Routes
router.get('/wedding/:id', WeddingController.getWeddingCard);
router.get('/api/qrcode/generate', WeddingController.generateQRCode);

// Message Routes
router.post('/api/messages/add', WeddingController.addMessage);
router.get('/api/messages', WeddingController.getMessages);

// RSVP Routes
router.post('/api/rsvp/submit', WeddingController.submitRSVP);
router.get('/api/rsvp/list', WeddingController.getRSVPList);

// Gift Routes
router.get('/api/gifts', WeddingController.getGifts);

// Statistics Routes
router.get('/api/statistics', WeddingController.getStatistics);

module.exports = router;
