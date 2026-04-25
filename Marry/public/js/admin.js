/* ============================================
   ADMIN DASHBOARD JAVASCRIPT
   ============================================ */

const menuLinks = document.querySelectorAll('.menu-link');
const sections = document.querySelectorAll('.admin-section');

// Section Navigation
menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove active class from all links and sections
    menuLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // Add active class to clicked link
    link.classList.add('active');

    // Get section ID from href
    const sectionId = link.getAttribute('href');
    const section = document.querySelector(sectionId);

    if (section) {
      section.classList.add('active');
    }
  });
});

// Load Statistics
async function loadStatistics() {
  try {
    const response = await fetch('/api/statistics');
    const data = await response.json();

    if (data.success) {
      const stats = data.data;

      // Update Dashboard
      document.getElementById('dashRsvpCount').textContent = stats.totalRSVP;
      document.getElementById('dashMessageCount').textContent = stats.totalMessages;
      document.getElementById('dashGiftCount').textContent = stats.purchasedGifts;
      document.getElementById('dashGuestCount').textContent = stats.totalGuests;

      // Update Statistics Table
      const statsTableBody = document.getElementById('statsTableBody');
      statsTableBody.innerHTML = `
        <tr>
          <td>Tổng RSVP</td>
          <td>${stats.totalRSVP}</td>
        </tr>
        <tr>
          <td>Sẽ Tham Dự (Yes)</td>
          <td>${stats.yesCount}</td>
        </tr>
        <tr>
          <td>Không Tham Dự (No)</td>
          <td>${stats.noCount}</td>
        </tr>
        <tr>
          <td>Chưa Chắc (Maybe)</td>
          <td>${stats.maybeCount}</td>
        </tr>
        <tr>
          <td>Tổng Số Khách</td>
          <td>${stats.totalGuests}</td>
        </tr>
        <tr>
          <td>Tổng Lời Chúc</td>
          <td>${stats.totalMessages}</td>
        </tr>
        <tr>
          <td>Tổng Quà Tặng</td>
          <td>${stats.totalGifts}</td>
        </tr>
        <tr>
          <td>Quà Đã Chọn</td>
          <td>${stats.purchasedGifts}</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

// Load RSVP List
async function loadRSVPList() {
  try {
    const response = await fetch('/api/rsvp/list');
    const data = await response.json();

    if (data.success) {
      const rsvpTableBody = document.getElementById('rsvpTableBody');
      rsvpTableBody.innerHTML = '';

      if (data.data && data.data.length > 0) {
        data.data.forEach(rsvp => {
          const row = document.createElement('tr');
          const attendanceText = {
            'yes': '✓ Sẽ Tham Dự',
            'no': '✗ Không Tham Dự',
            'maybe': '? Chưa Chắc'
          }[rsvp.attendance] || rsvp.attendance;

          row.innerHTML = `
            <td>${escapeHtml(rsvp.guestName)}</td>
            <td>${attendanceText}</td>
            <td>${rsvp.guestCount}</td>
            <td>${escapeHtml(rsvp.dietary)}</td>
            <td>${rsvp.submittedDate}</td>
          `;

          rsvpTableBody.appendChild(row);
        });
      } else {
        rsvpTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có RSVP nào</td></tr>';
      }
    }
  } catch (error) {
    console.error('Error loading RSVP list:', error);
  }
}

// Load Messages
async function loadMessages() {
  try {
    const response = await fetch('/api/messages');
    const data = await response.json();

    if (data.success) {
      const messagesContainer = document.getElementById('adminMessages');
      messagesContainer.innerHTML = '';

      if (data.data && data.data.length > 0) {
        data.data.forEach(msg => {
          const messageCard = document.createElement('div');
          messageCard.className = 'admin-message-card';
          messageCard.innerHTML = `
            <div class="admin-message-header">
              <div class="admin-message-name">${escapeHtml(msg.guestName)}</div>
              <div class="admin-message-date">${new Date(msg.timestamp).toLocaleDateString('vi-VN')}</div>
            </div>
            <p class="admin-message-text">${escapeHtml(msg.message)}</p>
          `;

          messagesContainer.appendChild(messageCard);
        });
      } else {
        messagesContainer.innerHTML = '<p style="text-align: center;">Chưa có lời chúc nào</p>';
      }
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set first menu as active
  if (menuLinks.length > 0) {
    menuLinks[0].classList.add('active');
  }

  // Load all data
  loadStatistics();
  loadRSVPList();
  loadMessages();

  // Refresh data every 30 seconds
  setInterval(() => {
    loadStatistics();
    loadRSVPList();
    loadMessages();
  }, 30000);
});
