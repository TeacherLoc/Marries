# 👨‍💻 Dev Script - Hướng Dẫn Triển Khai Chi Tiết cho Developer

Tài liệu này dành cho developer thực hiện các tùy chỉnh và nâng cấp website thiệp cưới online.

---

## A. CÔNG NGHỆ STACK

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Animations, Transitions
- **JavaScript (ES6+)** - DOM manipulation, Event handling
- **Swiper.js** - Image carousel library
- **AOS.js** - Scroll-triggered animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework (v4.18.2)
- **EJS** - Template engine
- **QRCode.js** - QR code generation
- **Body-Parser** - Request parsing

### Data Storage
- **JSON File** - `data/wedding.json` (local storage, no database)

### CDN Resources
```html
<!-- Swiper CSS/JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- AOS JS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
```

---

## B. CẤU TRÚC DỰ ÁN

```
wedding-website/
├── server/
│   ├── app.js                 # Express server entry point
│   ├── routes/
│   │   └── wedding.js         # Route definitions
│   ├── controllers/
│   │   └── WeddingController.js
│   └── models/
│       └── WeddingModel.js    # Data model (JSON)
│
├── views/
│   ├── wedding-card.ejs       # Main wedding page
│   ├── admin.ejs              # Admin dashboard
│   └── error.ejs              # Error page
│
├── public/
│   ├── css/
│   │   ├── style.css          # Main styles + animations
│   │   └── admin.css          # Admin styles
│   └── js/
│       ├── main.js            # Client-side logic
│       └── admin.js           # Admin dashboard logic
│
├── data/
│   └── wedding.json           # Wedding data (JSON)
│
├── package.json               # Dependencies
├── README.md                  # User guide
├── QUICK_START.md             # Quick start guide
└── FEATURES_GUIDE.md          # Features documentation
```

---

## C. KỸ THUẬT TRIỂN KHAI CỤ THỂ

### 1. Hiệu Ứng Mở Bìa Thiệp (Envelope)

**File**: `public/css/style.css` + `public/js/main.js`

**CSS Animation**:
```css
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.envelope {
    animation: float 3s ease-in-out infinite;
}
```

**JavaScript Logic** (`initEnvelopeAnimation()`):
```javascript
// Bấm để mở
envelope.addEventListener('click', () => {
    envelope.classList.remove('active');
    envelope.classList.add('closed');
});

// Tự động đóng sau 10 giây
setTimeout(() => {
    if (envelope.classList.contains('active')) {
        envelope.classList.add('closed');
    }
}, 10000);
```

**Cách Tùy Chỉnh**:
- Thay đổi text trong `views/wedding-card.ejs`
- Adjust thời gian delay: `setTimeout(..., 10000)` → 10 giây
- Thay đổi màu: Update `--primary-color` trong CSS

---

### 2. Swiper.js Gallery

**Khởi Tạo** (`public/js/main.js`):
```javascript
const gallerySwiper = new Swiper('.gallery-swiper', {
    loop: true,                    // Loop infinite
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000,              // 5 giây/slide
        disableOnInteraction: false,
    },
    effect: 'fade',               // Fade effect
    breakpoints: {
        640: { slidesPerView: 1 }
    }
});
```

**Thêm Ảnh** (`data/wedding.json`):
```json
"gallery": [
  {
    "url": "https://example.com/image.jpg",
    "caption": "Tiêu đề ảnh",
    "category": "ceremony"
  }
]
```

**Bộ Lọc** (Sử dụng JavaScript):
- Filter buttons: `.filter-btn`
- Filter value: `data-filter="all|ceremony|reception|moments"`
- Item category: `.gallery-item[data-category]`

---

### 3. AOS (Animate On Scroll)

**Khởi Tạo** (`public/js/main.js`):
```javascript
AOS.init({
    duration: 1000,              // Animation duration
    offset: 100,                 // Trigger offset
    easing: 'ease-in-out-cubic',
    once: false,
    mirror: true
});
```

**Sử Dụng**:
```html
<!-- Fade up animation -->
<section data-aos="fade-up"></section>

<!-- Zoom in animation -->
<section data-aos="zoom-in"></section>

<!-- Customize duration -->
<section data-aos="fade-up" data-aos-duration="2000"></section>

<!-- Customize delay -->
<section data-aos="fade-up" data-aos-delay="200"></section>
```

**Các Animation Có Sẵn**:
- `fade` - Fade in/out
- `fade-up` - Fade + move up
- `fade-down` - Fade + move down
- `zoom-in` - Scale up
- `flip-left/right` - Flip animation

---

### 4. Music Player

**Kiểu Dáng** (Floating button):
```css
.music-player {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
}

.music-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    animation: float 3s ease-in-out infinite;
}
```

**JavaScript Logic** (`initMusicPlayer()`):
```javascript
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        backgroundMusic.pause();
        musicToggle.textContent = '🎵';
        isPlaying = false;
    } else {
        backgroundMusic.play();
        musicToggle.textContent = '🎶';
        isPlaying = true;
    }
});
```

**Đặt URL Nhạc** (`data/wedding.json`):
```json
"backgroundMusic": "https://example.com/music.mp3"
```

---

### 5. Countdown Timer

**Cấu Trúc** (`public/js/main.js`):
```javascript
function updateCountdown() {
    const weddingDate = new Date('2024-06-15T08:00:00').getTime();
    
    setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            // ... minutes, seconds
            
            // Update DOM
            document.getElementById('days').textContent = days;
        }
    }, 1000);
}
```

**Format Ngày Giờ**:
- `YYYY-MM-DD` - Ngày (từ `wedding.ceremonyDate`)
- `HH:MM` - Giờ (từ `wedding.ceremonyTime`)

---

### 6. RSVP Form & Submission

**Form Markup** (`views/wedding-card.ejs`):
```html
<form id="rsvp-form" class="rsvp-form">
    <input name="guestName" required />
    <input name="phoneNumber" required />
    <select name="attendance" required>
        <option value="true">Tôi sẽ tham dự</option>
        <option value="false">Không thể tham dự</option>
    </select>
    <input name="numberOfGuests" type="number" min="1" value="1" />
    <input name="dietaryPreferences" placeholder="Yêu cầu đặc biệt" />
    <button type="submit" class="btn-submit">Gửi</button>
</form>
```

**JavaScript Handler**:
```javascript
document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Send to backend
    const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
        // Show success message
        showSuccessNotification('Cảm ơn bạn!');
    }
});
```

**Backend Handler** (`server/controllers/WeddingController.js`):
```javascript
submitRSVP: (req, res) => {
    const { guestName, phoneNumber, attendance, numberOfGuests } = req.body;
    
    // Validation
    if (!guestName || !phoneNumber) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    
    // Save to model
    const rsvp = WeddingModel.addRSVP(req.body);
    res.json({ success: true, rsvp });
}
```

---

### 7. Data Model (JSON Storage)

**File**: `server/models/WeddingModel.js`

**Cấu Trúc**:
```javascript
const WeddingModel = {
    getAll: () => {/* Read JSON */},
    saveAll: (data) => {/* Write JSON */},
    addRSVP: (rsvpData) => {/* Add to array */},
    getAllRSVPs: () => {/* Get array */}
};
```

**Đặc Điểm**:
- Đọc/ghi file JSON đồng bộ
- Mỗi request tạo ID timestamp
- Không có database, dữ liệu lưu local

**Tối Ưu Hóa**:
- Backup định kỳ: `cp data/wedding.json data/wedding.backup.json`
- Đối với production: Migrate sang MongoDB/PostgreSQL

---

## D. API ENDPOINTS

### GET Endpoints
```
GET /                          # Main wedding page
GET /admin                      # Admin dashboard
GET /api/wedding-data          # Get all data (for admin)
```

### POST Endpoints
```
POST /api/rsvp                 # Submit RSVP
POST /api/guestbook            # Submit guestbook entry
POST /api/couple-info          # Update couple info (admin)
POST /api/wedding-details      # Update wedding details (admin)
```

### Request/Response Examples

**RSVP Request**:
```json
{
    "guestName": "Trần Văn A",
    "phoneNumber": "0123456789",
    "attendance": true,
    "numberOfGuests": 2,
    "dietaryPreferences": "Ăn chay"
}
```

**RSVP Response**:
```json
{
    "success": true,
    "rsvp": {
        "id": 1234567890,
        "guestName": "Trần Văn A",
        "timestamp": "2024-05-09T10:30:00.000Z"
    }
}
```

---

## E. PERFORMANCE OPTIMIZATION

### Frontend Optimization
1. **Lazy Loading**: Thêm `loading="lazy"` vào `<img>`
2. **Image Optimization**: Nén ảnh trước khi upload (< 500KB/ảnh)
3. **CSS**: Minify trước production
4. **JavaScript**: Async loading của CDN scripts

### Backend Optimization
1. **Caching**: Add `Cache-Control` headers
2. **Compression**: Enable gzip compression
3. **Connection Pool**: Optimize nếu dùng database

### Monitoring
- Check browser DevTools: Performance tab
- Lighthouse audit: Chrome → Right-click → Lighthouse

---

## F. MOBILE COMPATIBILITY

### Testing Checklist
- [ ] QR code quét trên camera app
- [ ] Gallery vuốt trên touch screen
- [ ] Form input trên keyboard mobile
- [ ] Video embed phát trên mobile
- [ ] Music player hoạt động
- [ ] Responsive layout tất cả device

### Touch Events
```javascript
// For Swiper - built-in support
// For custom: addEventListener('touchstart', handler)
```

### Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## G. DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Remove console.log statements
- [ ] Test all features locally
- [ ] Backup `data/wedding.json`
- [ ] Minify CSS/JS
- [ ] Optimize images
- [ ] Test on mobile devices

### Environment Variables
```javascript
// .env (if needed)
PORT=3000
NODE_ENV=production
```

### Server Setup
```bash
# Production setup
npm install --production
PORT=3000 npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start server/app.js --name "wedding"
```

---

## H. TROUBLESHOOTING

### Common Issues

**Issue**: Mã QR không quét được
- **Solution**: Tăng size mã QR, kiểm tra contrast

**Issue**: Nhạc không phát trên mobile
- **Solution**: Thêm user interaction (click music button), đặt muted="false"

**Issue**: Gallery không scroll
- **Solution**: Kiểm tra Swiper version compatibility, clear browser cache

**Issue**: AOS animations không chạy
- **Solution**: Kiểm tra `data-aos` attributes, kích hoạt DevTools console

---

## I. CẬP NHẬT & BẢO TRÌ

### Kiểm Tra Cập Nhật Thư Viện
```bash
npm outdated
npm update
```

### Cập Nhật Cụ Thể
```bash
npm install swiper@latest
npm install aos@latest
```

---

**Happy Coding! 👨‍💻🎉**
