const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/wedding.json');

class WeddingModel {
  static getData() {
    try {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading wedding data:', error);
      return null;
    }
  }

  static saveData(data) {
    try {
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving wedding data:', error);
      return false;
    }
  }

  static getCouple() {
    const data = this.getData();
    return data ? data.couple : null;
  }

  static getEvent() {
    const data = this.getData();
    return data ? data.event : null;
  }

  static getLocation() {
    const data = this.getData();
    return data ? data.location : null;
  }

  static getGallery() {
    const data = this.getData();
    return data ? data.gallery : [];
  }

  static getMessages() {
    const data = this.getData();
    return data ? data.messages : [];
  }

  static addMessage(guestName, message) {
    const data = this.getData();
    if (!data) return false;

    const newMessage = {
      id: Math.max(...data.messages.map(m => m.id), 0) + 1,
      guestName,
      message,
      timestamp: new Date().toISOString()
    };

    data.messages.push(newMessage);
    return this.saveData(data) ? newMessage : null;
  }

  static getRSVPList() {
    const data = this.getData();
    return data ? data.rsvpList : [];
  }

  static addRSVP(rsvpData) {
    const data = this.getData();
    if (!data) return false;

    const newRSVP = {
      id: Math.max(...data.rsvpList.map(r => r.id), 0) + 1,
      guestName: rsvpData.guestName,
      attendance: rsvpData.attendance,
      guestCount: rsvpData.guestCount,
      dietary: rsvpData.dietary,
      submittedDate: new Date().toISOString().split('T')[0]
    };

    data.rsvpList.push(newRSVP);
    return this.saveData(data) ? newRSVP : null;
  }

  static getGifts() {
    const data = this.getData();
    return data ? data.gifts : [];
  }

  static getGuestInformation() {
    const data = this.getData();
    return data ? data.guestInformation : {};
  }

  static getWeddingInfo() {
    const data = this.getData();
    if (!data) return null;

    return {
      couple: data.couple,
      event: data.event,
      location: data.location,
      gallery: data.gallery,
      messages: data.messages,
      guestInformation: data.guestInformation
    };
  }
}

module.exports = WeddingModel;
