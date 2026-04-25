const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/wedding.json');

// Initialize data file if it doesn't exist
const initializeData = () => {
  if (!fs.existsSync(dataPath)) {
    const initialData = {
      couple: {
        brideName: 'Cô dâu',
        groomName: 'Chú rể',
        parentsBride: {
          father: 'Ông',
          mother: 'Bà'
        },
        parentsGroom: {
          father: 'Ông',
          mother: 'Bà'
        },
        welcomeMessage: 'Trân trọng kính mời quý khách tham dự lễ cưới'
      },
      wedding: {
        ceremonyDate: '2024-06-15',
        ceremonyTime: '08:00',
        ceremonyLocation: 'Nhà thờ',
        receptionDate: '2024-06-15',
        receptionTime: '18:00',
        receptionLocation: 'Nhà hàng',
        receptionAddress: 'Địa chỉ nhà hàng',
        coordinates: { lat: 0, lng: 0 }
      },
      loveStory: [
        {
          year: 2020,
          title: 'Gặp gỡ',
          description: 'Chúng tôi đã gặp nhau...'
        }
      ],
      gallery: [],
      preWeddingVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      digitalGift: {
        bankName: 'Ngân hàng',
        accountHolder: 'Tên chủ tài khoản',
        accountNumber: '0123456789',
        qrCode: ''
      },
      rsvps: [],
      guestbook: []
    };
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
  }
};

// Initialize on load
initializeData();

const WeddingModel = {
  // Get all data
  getAll: () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  },

  // Save all data
  saveAll: (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  },

  // Get couple info
  getCouple: () => {
    const data = WeddingModel.getAll();
    return data.couple;
  },

  // Update couple info
  updateCouple: (coupleData) => {
    const data = WeddingModel.getAll();
    data.couple = { ...data.couple, ...coupleData };
    WeddingModel.saveAll(data);
    return data.couple;
  },

  // Get wedding details
  getWeddingDetails: () => {
    const data = WeddingModel.getAll();
    return data.wedding;
  },

  // Update wedding details
  updateWeddingDetails: (weddingData) => {
    const data = WeddingModel.getAll();
    data.wedding = { ...data.wedding, ...weddingData };
    WeddingModel.saveAll(data);
    return data.wedding;
  },

  // Add RSVP
  addRSVP: (rsvpData) => {
    const data = WeddingModel.getAll();
    const rsvp = {
      id: Date.now(),
      ...rsvpData,
      timestamp: new Date().toISOString()
    };
    data.rsvps.push(rsvp);
    WeddingModel.saveAll(data);
    return rsvp;
  },

  // Get all RSVPs
  getAllRSVPs: () => {
    const data = WeddingModel.getAll();
    return data.rsvps;
  },

  // Add guestbook entry
  addGuestbookEntry: (entry) => {
    const data = WeddingModel.getAll();
    const newEntry = {
      id: Date.now(),
      ...entry,
      timestamp: new Date().toISOString()
    };
    data.guestbook.push(newEntry);
    WeddingModel.saveAll(data);
    return newEntry;
  },

  // Get all guestbook entries
  getAllGuestbookEntries: () => {
    const data = WeddingModel.getAll();
    return data.guestbook;
  },

  // Update digital gift
  updateDigitalGift: (giftData) => {
    const data = WeddingModel.getAll();
    data.digitalGift = { ...data.digitalGift, ...giftData };
    WeddingModel.saveAll(data);
    return data.digitalGift;
  },

  // Get digital gift
  getDigitalGift: () => {
    const data = WeddingModel.getAll();
    return data.digitalGift;
  }
};

module.exports = WeddingModel;
