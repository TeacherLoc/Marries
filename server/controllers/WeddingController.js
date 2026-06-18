const WeddingModel = require('../models/WeddingModel');
const QRCode = require('qrcode');
const https = require('https');

// Thay chuỗi bên dưới bằng URL Web App MỚI mà bạn vừa copy ở Bước 1
const GG_SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxJF46IeiCRTuTQcilWmFzuk5jqMznWvPOz1EHYz9uibssrH6gyc2Z2mol0umvteBYy/exec';

// Biến lưu trữ Cache (Bộ nhớ đệm)
let cachedGuestbook = [];
let lastFetchTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // Thời gian làm mới cache: 2 phút (tính bằng milliseconds)

// Hàm hỗ trợ kéo dữ liệu trực tiếp từ Google Sheets
const fetchFromGoogleSheets = () => {
  return new Promise((resolve) => {
    if (!GG_SHEET_WEBHOOK) return resolve([]);
    
    // Nếu đã có cache và chưa quá 2 phút, trả về ngay lập tức (không bắt người dùng chờ)
    if (cachedGuestbook.length > 0 && (Date.now() - lastFetchTime < CACHE_TTL)) {
      return resolve(cachedGuestbook);
    }

    const request = (url) => {
      https.get(url, (res) => {
        // Xử lý vòng lặp chuyển hướng đặc thù của Google
        if (res.statusCode === 301 || res.statusCode === 302) {
          return request(res.headers.location);
        }
        let rawData = '';
        res.on('data', chunk => rawData += chunk);
        res.on('end', () => {
          try { 
            let parsedData = JSON.parse(rawData);
            // Tự động nhận diện và loại bỏ dòng tiêu đề (dòng 1) nếu có
            if (parsedData.length > 0) {
              const first = parsedData[0];
              const isHeader = 
                String(first.timestamp).toLowerCase().includes('thời gian') ||
                String(first.guestName).toLowerCase().includes('tên') ||
                String(first.message).toLowerCase().includes('lời chúc');
              
              if (isHeader) {
                parsedData.shift(); // Cắt bỏ dòng đầu tiên (tiêu đề)
              }
            }
            
            // Cập nhật Cache mới
            cachedGuestbook = parsedData;
            lastFetchTime = Date.now();
            resolve(parsedData); 
          }
          catch (e) { resolve(cachedGuestbook.length > 0 ? cachedGuestbook : []); }
        });
      }).on('error', () => resolve(cachedGuestbook.length > 0 ? cachedGuestbook : []));
    };
    request(GG_SHEET_WEBHOOK);
  });
};

const WeddingController = {
  // Render main wedding card page
  getWeddingCard: async (req, res) => {
    try {
      const data = WeddingModel.getAll();
      const guestbookEntries = await fetchFromGoogleSheets();

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
      const { guestName, message, guestType } = req.body;

      if (!guestName || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // NGỪNG LƯU TĨNH - Chỉ tạo dấu thời gian để đẩy thẳng lên Sheets
      const timestamp = new Date().toISOString();
      const type = guestType || 'Khách chung';

      // --- BẮN DỮ LIỆU SANG GOOGLE SHEETS ---
      if (GG_SHEET_WEBHOOK) {
        const payload = JSON.stringify({ guestName, message, guestType: type, timestamp: timestamp });
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
        
        // Thêm ngay lời chúc mới vào bộ đệm để khách thấy ngay lập tức trên web
        cachedGuestbook.push({ guestName, message, guestType: type, timestamp: timestamp });
      }
      // ---------------------------------------

      res.json({ success: true, entry: { guestName, message, guestType: type, timestamp } });
    } catch (error) {
      console.error('Error submitting guestbook entry:', error);
      res.status(500).json({ error: 'Error submitting guestbook entry' });
    }
  },

  // Admin page - view all RSVPs and guestbook
  getAdminDashboard: async (req, res) => {
    try {
      const rsvps = WeddingModel.getAllRSVPs();
      const guestbook = await fetchFromGoogleSheets();
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
