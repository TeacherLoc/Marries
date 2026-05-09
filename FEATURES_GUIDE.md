# 🎊 Hướng Dẫn Tính Năng Chuyên Nghiệp Thiệp Cưới Online

Tài liệu này mô tả tất cả các tính năng nâng cao đã được triển khai trên website thiệp cưới của bạn.

---

## 1. 📮 Hiệu Ứng Mở Bìa Thiệp (Envelope Opening Animation)

### Mô Tả
Khi khách mời truy cập website, họ sẽ thấy một bìa thư ảo với text "Bạn Nhận Được Một Lời Mời Cưới". Nhấn vào bìa hoặc chờ 10 giây sẽ tự động mở bìa và hiển thị nội dung thiệp.

### Tính Năng
- ✨ Hiệu ứng 3D lật bìa thư khi hover
- 🎨 Gradient background thanh lịch
- 🎯 Tự động đóng sau 10 giây
- 📱 Responsive trên mọi thiết bị

### Cách Tùy Chỉnh
Sửa file `views/wedding-card.ejs`:
```html
<div id="envelope-overlay" class="envelope-overlay active">
    <div class="envelope">
        <div class="envelope-cover">
            <div class="envelope-text">
                <h2>Bạn Nhận Được Một Lời Mời Cưới</h2>
                <p>Bấm để mở</p>
            </div>
        </div>
    </div>
</div>
```

---

## 2. 🎵 Trình Phát Nhạc Nền (Background Music Player)

### Mô Tả
Nút nhạc nổi ở góc dưới bên phải màn hình. Khách mời có thể bật/tắt nhạc nền để tạo bầu không khí lãng mạn.

### Tính Năng
- 🎶 Nút nổi với hiệu ứng floating
- 🎯 Click để bật/tắt nhạc
- 🎨 Thay đổi biểu tượng khi phát (🎵 → 🎶)
- ⚙️ Nhạc loop vô tận

### Cách Thay Đổi Nhạc
Sửa file `data/wedding.json`:
```json
"backgroundMusic": "URL_TO_YOUR_MUSIC.mp3"
```

### Nguồn Nhạc Gợi Ý
- **YouTube Audio Library**: https://www.youtube.com/audio
- **Bensound**: https://www.bensound.com (có license)
- **Free Music Archive**: https://freemusicarchive.org

---

## 3. 🖼️ Album Ảnh Cưới (Swiper.js Gallery)

### Mô Tả
Album ảnh sử dụng thư viện Swiper.js với các tính năng nâng cao:
- Carousel tự động chuyển slide
- Vuốt/dấu chuột để chuyển ảnh
- Bộ lọc ảnh theo danh mục
- Pagination indicators

### Các Danh Mục Ảnh
1. **Tất Cả** (All) - Hiển thị tất cả ảnh
2. **Lễ Cưới** (Ceremony) - Ảnh lễ cưới chính thức
3. **Tiệc Cưới** (Reception) - Ảnh tiệc cưới
4. **Khoảnh Khắc** (Moments) - Ảnh khoảnh khắc đặc biệt

### Cách Thêm Ảnh
Sửa file `data/wedding.json`:
```json
"gallery": [
  {
    "url": "https://link-to-image.jpg",
    "caption": "Mô tả ảnh",
    "category": "ceremony"  // all, ceremony, reception, moments
  }
]
```

### Tính Năng Swiper
- 📱 Responsive: 1 ảnh/slide trên mobile
- 🔄 Auto-play: Chuyển ảnh mỗi 5 giây
- ➡️ Nút chuyển: Prev/Next
- 🔵 Pagination: Chấm chỉ báo vị trí

---

## 4. ✨ Scroll-Triggered Animations (AOS)

### Mô Tả
Các phần tử trên trang sẽ hiển thị với hiệu ứng animation khi khách cuộn xuống trang (Animate On Scroll).

### Các Hiệu Ứng
- `fade-up` - Mờ dần với hiệu ứng lên
- `zoom-in` - Phóng to dần vào
- `flip-left` - Lật trái
- `flip-right` - Lật phải

### Cách Sử Dụng
Thêm attribute `data-aos` vào bất kỳ element nào:
```html
<section data-aos="fade-up">...</section>
<div data-aos="zoom-in">...</div>
```

### Thay Đổi Cài Đặt AOS
Sửa file `public/js/main.js`:
```javascript
AOS.init({
    duration: 1000,      // Thời gian animation (ms)
    offset: 100,         // Offset kích hoạt (pixels)
    easing: 'ease-in-out-cubic',
    once: false,         // Chạy nhiều lần khi cuộn
    mirror: true         // Animation khi cuộn up/down
});
```

---

## 5. 🎬 Video Pre-Wedding

### Mô Tả
Nhúng video từ YouTube hoặc Vimeo với lazy loading tự động.

### Cách Thêm Video
Sửa file `data/wedding.json`:
```json
"preWeddingVideo": "https://www.youtube.com/embed/VIDEO_ID"
```

### Cách Lấy Embed URL
Từ YouTube:
1. Mở video YouTube
2. Nhấn "Share" → "Embed"
3. Copy URL: `https://www.youtube.com/embed/VIDEO_ID`

---

## 6. 📍 Tích Hợp Google Maps

### Mô Tả
Hiển thị bản đồ Google Maps nhúng trong thiệp với chỉ báo địa điểm tổ chức.

### Cách Tùy Chỉnh
Sửa file `data/wedding.json`:
```json
"wedding": {
    "receptionAddress": "123 Đường Tôn Đức Thắng, Hà Nội",
    "coordinates": {
        "lat": 21.0285,
        "lng": 105.8542
    }
}
```

### Cách Lấy Tọa Độ
Trên Google Maps:
1. Chuột phải vào địa điểm
2. Copy tọa độ (latitude, longitude)

---

## 7. 📱 Mobile-First Design

### Tối Ưu Mobile
- ✅ Responsive layout
- ✅ Touch-friendly buttons
- ✅ Large touch targets (≥44x44px)
- ✅ Fast loading
- ✅ QR code dễ quét

### Kiểm Tra Trên Mobile
1. iOS: Mở Safari → truy cập URL
2. Android: Mở Chrome → truy cập URL
3. Test quét QR: Sử dụng Camera app hoặc Zalo

---

## 8. 🔗 Cắt Ngắn Liên Kết (URL Shortening)

### Lợi Ích
- Mã QR nhỏ hơn → dễ quét hơn
- Link ngắn gọn → dễ nhớ
- Analytics tracking

### Dịch Vụ Gợi Ý
1. **Bitly** - https://bitly.com
2. **Short.io** - https://short.io
3. **TinyURL** - https://tinyurl.com

### Cách Sử Dụng
1. Vào dịch vụ cắt ngắn
2. Paste URL website thiệp cưới
3. Copy shortened URL
4. Sử dụng để tạo mã QR

---

## 9. ✅ Xác Nhận Tham Dự (RSVP Enhanced)

### Tính Năng
- 📝 Form thu thập: Tên, số điện thoại, xác nhận, số người, yêu cầu đặc biệt
- 💾 Lưu trữ dữ liệu trong `data/wedding.json`
- 📊 Dashboard quản lý
- 🔔 Thông báo thành công

### Dữ Liệu RSVP
```json
{
    "guestName": "Tên khách",
    "phoneNumber": "0123456789",
    "attendance": true,
    "numberOfGuests": 2,
    "dietaryPreferences": "Ăn chay"
}
```

---

## 10. 📖 Sổ Lời Chúc (Guestbook)

### Tính Năng
- 💬 Khách để lại lời chúc
- 📝 Hiển thị 5 lời chúc gần nhất
- 👀 Xem tất cả trên trang quản trị
- 📅 Hiển thị ngày giờ gửi

---

## 11. 🎛️ Dashboard Quản Trị

### Truy Cập
```
http://localhost:3000/admin
```

### Thông Tin Hiển Thị
- 📊 Thống kê: Tổng RSVP, xác nhận, không tham dự
- 👥 Danh sách khách chi tiết
- 💬 Tất cả lời chúc gửi đến
- 📈 Tổng số khách dự kiến

---

## 12. 🎨 Tùy Chỉnh Giao Diện

### Màu Sắc
Sửa file `public/css/style.css`:
```css
:root {
    --primary-color: #d4a5a5;      /* Màu chính (hồng nhạt) */
    --secondary-color: #f5f5f5;    /* Màu phụ (xám nhạt) */
    --text-color: #333;             /* Màu chữ */
    --accent-gold: #d4af37;         /* Màu nhấn (vàng) */
}
```

### Font Chữ
Thay đổi trong `public/css/style.css`:
```css
body {
    font-family: 'Georgia', 'Calligraphy', serif;
    /* Hoặc: 'Playfair Display', 'Montserrat', etc. */
}
```

---

## 📋 Checklist Triển Khai

- [ ] Cập nhật thông tin cặp đôi trong `data/wedding.json`
- [ ] Thêm ảnh vào gallery
- [ ] Chọn nhạc nền
- [ ] Cung cấp video pre-wedding
- [ ] Cập nhật Google Maps coordinates
- [ ] Tùy chỉnh màu sắc/font nếu cần
- [ ] Cắt ngắn URL và tạo mã QR
- [ ] Test trên iOS & Android
- [ ] Test RSVP form
- [ ] Test gallery filters
- [ ] Kiểm tra music player
- [ ] Deploy lên server

---

## 🚀 Triển Khai (Deployment)

### Tùy Chọn Hosting
1. **Vercel** - Miễn phí, nhanh nhất
2. **Heroku** - Miễn phí, cơ bản
3. **Netlify** - Miễn phí, tốt cho static
4. **AWS/Azure** - Trả phí, mạnh mẽ

### Bước Cơ Bản
```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy test
npm start

# 3. Deploy
# (Tuỳ theo platform)
```

---

## 📞 Hỗ Trợ & Bảo Trì

- **Backup dữ liệu**: Copy `data/wedding.json` định kỳ
- **Cập nhật**: Kiểm tra cập nhật các thư viện
- **Monitor**: Kiểm tra số lượng RSVP thường xuyên

---

**Chúc bạn có một đám cưới tuyệt vời! 💑🎉**
