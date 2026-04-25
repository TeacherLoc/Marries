const express = require('express');
const WeddingController = require('../controllers/WeddingController');

const router = express.Router();

// Main wedding card page
router.get('/', WeddingController.getWeddingCard);

// RSVP
router.post('/api/rsvp', WeddingController.submitRSVP);

// Guestbook
router.post('/api/guestbook', WeddingController.submitGuestbookEntry);

// Admin dashboard
router.get('/admin', WeddingController.getAdminDashboard);

// Admin APIs
router.get('/api/wedding-data', WeddingController.getWeddingData);
router.post('/api/couple-info', WeddingController.updateCoupleInfo);
router.post('/api/wedding-details', WeddingController.updateWeddingDetails);

module.exports = router;
