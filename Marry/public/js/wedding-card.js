/* ============================================
   WEDDING CARD PAGE JAVASCRIPT
   ============================================ */

const messageForm = document.getElementById('messageForm');
const rsvpForm = document.getElementById('rsvpForm');

// Add Message
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const guestName = document.getElementById('guestName').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!guestName || !message) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  try {
    const response = await fetch('/api/messages/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ guestName, message })
    });

    const data = await response.json();

    if (data.success) {
      alert('Lời chúc đã được gửi!');
      messageForm.reset();
      loadMessages();
    } else {
      alert('Lỗi: ' + data.message);
    }
  } catch (error) {
    console.error('Error adding message:', error);
    alert('Lỗi gửi lời chúc');
  }
});

// Load Messages
async function loadMessages() {
  try {
    const response = await fetch('/api/messages');
    const data = await response.json();

    if (data.success) {
      const messagesContainer = document.getElementById('messagesContainer');
      messagesContainer.innerHTML = '';

      if (data.data && data.data.length > 0) {
        data.data.forEach(msg => {
          const messageCard = document.createElement('div');
          messageCard.className = 'message-card';
          messageCard.innerHTML = `
            <div class="message-header">
              <div class="guest-name">${escapeHtml(msg.guestName)}</div>
              <div class="message-date">${new Date(msg.timestamp).toLocaleDateString('vi-VN')}</div>
            </div>
            <p class="message-text">${escapeHtml(msg.message)}</p>
          `;
          messagesContainer.appendChild(messageCard);
        });
      } else {
        messagesContainer.innerHTML = '<p class="no-messages">Chưa có lời chúc nào. Hãy là người đầu tiên!</p>';
      }
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Submit RSVP
rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const guestName = document.getElementById('rsvpName').value.trim();
  const attendance = document.getElementById('attendance').value;
  const guestCount = document.getElementById('guestCount').value;
  const dietary = document.getElementById('dietary').value.trim();

  if (!guestName || !attendance) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
    return;
  }

  try {
    const response = await fetch('/api/rsvp/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ guestName, attendance, guestCount, dietary })
    });

    const data = await response.json();

    if (data.success) {
      alert('RSVP đã được gửi. Cảm ơn bạn!');
      rsvpForm.reset();
      updateRSVPCount();
    } else {
      alert('Lỗi: ' + data.message);
    }
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    alert('Lỗi gửi RSVP');
  }
});

// Update RSVP Count
async function updateRSVPCount() {
  try {
    const response = await fetch('/api/statistics');
    const data = await response.json();

    if (data.success) {
      const rsvpCount = document.getElementById('rsvpCount');
      const statsContainer = document.getElementById('statsContainer');

      statsContainer.innerHTML = `
        <div class="stat-card">
          <div class="stat-number">${data.data.totalRSVP}</div>
          <div class="stat-label">Khách Đã RSVP</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${data.data.yesCount}</div>
          <div class="stat-label">Sẽ Tham Dự</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${data.data.totalGuests}</div>
          <div class="stat-label">Tổng Khách</div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error updating RSVP count:', error);
  }
}

// Load Gifts
async function loadGifts() {
  try {
    const response = await fetch('/api/gifts');
    const data = await response.json();

    if (data.success) {
      const giftsContainer = document.getElementById('giftsContainer');
      giftsContainer.innerHTML = '';

      data.data.forEach(gift => {
        const giftCard = document.createElement('div');
        giftCard.className = 'gift-card';

        const status = gift.purchased ? 'purchased' : 'available';
        const statusText = gift.purchased ? 'Đã Chọn' : 'Còn Có';

        giftCard.innerHTML = `
          <img src="${gift.image}" alt="${gift.name}" class="gift-image" />
          <div class="gift-info">
            <div class="gift-name">${escapeHtml(gift.name)}</div>
            <div class="gift-description">${escapeHtml(gift.description)}</div>
            <div class="gift-price">${gift.price}</div>
            <div class="gift-status ${status}">${statusText}</div>
          </div>
        `;

        giftsContainer.appendChild(giftCard);
      });
    }
  } catch (error) {
    console.error('Error loading gifts:', error);
  }
}

// Load Map (Using Google Maps)
function initMap() {
  // Get ceremony location
  const ceremonyLat = 21.0285;
  const ceremonyLng = 105.8142;

  const map = new google.maps.Map(document.getElementById('eventMap'), {
    zoom: 13,
    center: { lat: ceremonyLat, lng: ceremonyLng }
  });

  // Add ceremony marker
  new google.maps.Marker({
    position: { lat: ceremonyLat, lng: ceremonyLng },
    map: map,
    title: 'Nhà Thờ Đức Mẽ',
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  });

  // Add reception marker
  const receptionLat = 21.0333;
  const receptionLng = 105.8341;

  new google.maps.Marker({
    position: { lat: receptionLat, lng: receptionLng },
    map: map,
    title: 'Grandview Hotel',
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadMessages();
  updateRSVPCount();
  loadGifts();
  // Uncomment if Google Maps API key is set
  // initMap();
});
