const WeddingModel = require('../models/WeddingModel');
const QRCode = require('qrcode');
const https = require('https');

const WeddingController = {
  // Render main wedding card page
  getWeddingCard: async (req, res) => {
    try {
      const data = WeddingModel.getAll();
      const guestbookEntries = WeddingModel.getAllGuestbookEntries();

      // Generate QR code for the website URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const qrCode = await QRCode.toDataURL(baseUrl);

      res.render('wedding-card', {
        couple: data.couple,
        wedding: data.wedding,
        loveStory: data.loveStory,
        gallery: data.gallery,
        preWeddingVideo: data.preWeddingVideo,
        preWeddingPhoto: data.preWeddingPhoto,
        digitalGift: data.digitalGift,
        theme: data.theme,
        guestbookEntries: guestbookEntries.slice(-5), // Last 5 entries
        qrCode: qrCode
      });
    } catch (error) {
      console.error('Error rendering wedding card:', error);
      res.status(500).render('error', { message: 'Error loading wedding card' });
    }
  },

  // Handle RSVP submission
  submitRSVP: (req, res) => {
    try {
      const { guestName, phoneNumber, attendance, numberOfGuests, dietaryPreferences } = req.body;

      // Validation
      if (!guestName || !phoneNumber || attendance === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const rsvpData = {
        guestName,
        phoneNumber,
        attendance: attendance === 'true' || attendance === true,
        numberOfGuests: parseInt(numberOfGuests) || 1,
        dietaryPreferences: dietaryPreferences || 'Không có'
      };

      const rsvp = WeddingModel.addRSVP(rsvpData);
      res.json({ success: true, rsvp });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      res.status(500).json({ error: 'Error submitting RSVP' });
    }
  },

  // Handle guestbook entry submission
  submitGuestbookEntry: (req, res) => {
    try {
      const { guestName, message } = req.body;

      if (!guestName || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const entry = WeddingModel.addGuestbookEntry({ guestName, message });

      // --- BẮN DỮ LIỆU SANG GOOGLE SHEETS ---
      // Thay chuỗi bên dưới bằng URL Web App mà bạn đã copy từ Google Sheets
      const GG_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxghiEm_VLpDdSzURN5OnA3UBh_OTw98Qocy7kvm6LTbCGVOkL-wqd00CrHPd_9wtGd/exec'; 
      if (GG_SHEET_WEBHOOK) {
        const payload = JSON.stringify({ guestName, message, timestamp: entry.timestamp });
        const webhookUrl = new URL(GG_SHEET_WEBHOOK);
        
        const reqSheet = https.request({
          hostname: webhookUrl.hostname,
          path: webhookUrl.pathname + webhookUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        }, (resSheet) => {
          // Google Apps Script luôn trả về 302 Redirect khi POST thành công
          if (resSheet.statusCode === 302 || resSheet.statusCode === 301) {
            https.get(resSheet.headers.location); // Gọi tiếp link redirect để hoàn tất
          }
        });
        reqSheet.on('error', (e) => console.error('Lỗi kết nối GG Sheets:', e.message));
        reqSheet.write(payload);
        reqSheet.end();
      }
      // ---------------------------------------

      res.json({ success: true, entry });
    } catch (error) {
      console.error('Error submitting guestbook entry:', error);
      res.status(500).json({ error: 'Error submitting guestbook entry' });
    }
  },

  // Admin page - view all RSVPs and guestbook
  getAdminDashboard: (req, res) => {
    try {
      const rsvps = WeddingModel.getAllRSVPs();
      const guestbook = WeddingModel.getAllGuestbookEntries();
      const data = WeddingModel.getAll();

      // Calculate statistics
      const totalRSVPs = rsvps.length;
      const attendingCount = rsvps.filter(r => r.attendance).length;
      const totalGuests = rsvps.reduce((sum, r) => sum + r.numberOfGuests, 0);

      res.render('admin', {
        rsvps,
        guestbook,
        couple: data.couple,
        statistics: {
          totalRSVPs,
          attendingCount,
          totalGuests,
          notAttendingCount: totalRSVPs - attendingCount
        }
      });
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      res.status(500).render('error', { message: 'Error loading dashboard' });
    }
  },

  // API: Get wedding data (for admin editing)
  getWeddingData: (req, res) => {
    try {
      const data = WeddingModel.getAll();
      res.json(data);
    } catch (error) {
      console.error('Error fetching wedding data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  },

  // API: Update couple info
  updateCoupleInfo: (req, res) => {
    try {
      const couple = WeddingModel.updateCouple(req.body);
      res.json({ success: true, couple });
    } catch (error) {
      console.error('Error updating couple info:', error);
      res.status(500).json({ error: 'Error updating couple info' });
    }
  },

  // API: Update wedding details
  updateWeddingDetails: (req, res) => {
    try {
      const wedding = WeddingModel.updateWeddingDetails(req.body);
      res.json({ success: true, wedding });
    } catch (error) {
      console.error('Error updating wedding details:', error);
      res.status(500).json({ error: 'Error updating wedding details' });
    }
  },

  // Admin page - theme settings
  getAdminTheme: (req, res) => {
    try {
      const data = WeddingModel.getAll();
      res.render('admin-theme', {
        couple: data.couple,
        theme: data.theme || {}
      });
    } catch (error) {
      console.error('Error loading theme settings:', error);
      res.status(500).render('error', { message: 'Error loading theme settings' });
    }
  },

  // API: Update theme
  updateTheme: (req, res) => {
    try {
      const theme = WeddingModel.updateTheme(req.body);
      res.json({ success: true, theme });
    } catch (error) {
      console.error('Error updating theme:', error);
      res.status(500).json({ error: 'Error updating theme' });
    }
  }
};

module.exports = WeddingController;
