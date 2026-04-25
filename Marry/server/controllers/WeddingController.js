const WeddingModel = require('../models/WeddingModel');
const QRCode = require('qrcode');

class WeddingController {
  static async getWeddingCard(req, res) {
    try {
      const weddingInfo = WeddingModel.getWeddingInfo();
      if (!weddingInfo) {
        return res.status(500).render('error', { 
          message: 'Unable to load wedding information',
          title: 'Lỗi'
        });
      }

      const weddingId = weddingInfo.couple.id;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const weddingUrl = `${baseUrl}/wedding/${weddingId}`;

      res.render('wedding-card', {
        couple: weddingInfo.couple,
        event: weddingInfo.event,
        gallery: weddingInfo.gallery,
        messages: weddingInfo.messages,
        guestInformation: weddingInfo.guestInformation,
        weddingUrl: weddingUrl,
        rsvpCount: WeddingModel.getRSVPList().length
      });
    } catch (error) {
      console.error('Error rendering wedding card:', error);
      return res.status(500).render('error', { 
        message: 'An error occurred while loading the wedding card',
        title: 'Lỗi'
      });
    }
  }

  static async generateQRCode(req, res) {
    try {
      const weddingInfo = WeddingModel.getWeddingInfo();
      if (!weddingInfo) {
        return res.status(500).json({ 
          success: false, 
          message: 'Unable to load wedding information' 
        });
      }

      const weddingId = weddingInfo.couple.id;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const weddingUrl = `${baseUrl}/wedding/${weddingId}`;

      const qrCodeDataUrl = await QRCode.toDataURL(weddingUrl, {
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      res.json({
        success: true,
        qrCode: qrCodeDataUrl,
        weddingUrl: weddingUrl
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error generating QR code' 
      });
    }
  }

  static addMessage(req, res) {
    try {
      const { guestName, message } = req.body;

      if (!guestName || !message) {
        return res.status(400).json({
          success: false,
          message: 'Guest name and message are required'
        });
      }

      const newMessage = WeddingModel.addMessage(guestName, message);
      if (newMessage) {
        return res.json({
          success: true,
          message: 'Message added successfully',
          data: newMessage
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Error saving message'
        });
      }
    } catch (error) {
      console.error('Error adding message:', error);
      return res.status(500).json({
        success: false,
        message: 'Error adding message'
      });
    }
  }

  static getMessages(req, res) {
    try {
      const messages = WeddingModel.getMessages();
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching messages'
      });
    }
  }

  static submitRSVP(req, res) {
    try {
      const { guestName, attendance, guestCount, dietary } = req.body;

      if (!guestName || !attendance) {
        return res.status(400).json({
          success: false,
          message: 'Guest name and attendance are required'
        });
      }

      const rsvpData = {
        guestName,
        attendance,
        guestCount: guestCount || 1,
        dietary: dietary || 'No restriction'
      };

      const newRSVP = WeddingModel.addRSVP(rsvpData);
      if (newRSVP) {
        return res.json({
          success: true,
          message: 'RSVP submitted successfully',
          data: newRSVP
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Error saving RSVP'
        });
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      return res.status(500).json({
        success: false,
        message: 'Error submitting RSVP'
      });
    }
  }

  static getRSVPList(req, res) {
    try {
      const rsvpList = WeddingModel.getRSVPList();
      res.json({
        success: true,
        data: rsvpList,
        total: rsvpList.length
      });
    } catch (error) {
      console.error('Error fetching RSVP list:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching RSVP list'
      });
    }
  }

  static getGifts(req, res) {
    try {
      const gifts = WeddingModel.getGifts();
      res.json({
        success: true,
        data: gifts
      });
    } catch (error) {
      console.error('Error fetching gifts:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching gifts'
      });
    }
  }

  static getStatistics(req, res) {
    try {
      const rsvpList = WeddingModel.getRSVPList();
      const messages = WeddingModel.getMessages();
      const gifts = WeddingModel.getGifts();

      const yesCount = rsvpList.filter(r => r.attendance === 'yes').length;
      const noCount = rsvpList.filter(r => r.attendance === 'no').length;
      const maybeCount = rsvpList.filter(r => r.attendance === 'maybe').length;
      const totalGuests = rsvpList.reduce((sum, r) => sum + (parseInt(r.guestCount) || 1), 0);

      res.json({
        success: true,
        data: {
          totalRSVP: rsvpList.length,
          yesCount,
          noCount,
          maybeCount,
          totalGuests,
          totalMessages: messages.length,
          totalGifts: gifts.length,
          purchasedGifts: gifts.filter(g => g.purchased).length
        }
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching statistics'
      });
    }
  }
}

module.exports = WeddingController;
