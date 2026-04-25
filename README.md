# Website Thiệp Cưới Cá Nhân Hóa

Một website thiệp cưới tương tác hoàn chỉnh với các tính năng RSVP, sổ lời chúc, và bảng quản trị cho cặp đôi.

## 🎉 Tính Năng

### Frontend
- ✨ **Thiết kế Mobile-First**: Tối ưu hoàn toàn cho thiết bị di động
- ⏳ **Đếm Ngược**: Countdown đến ngày cưới với hiệu ứng thời gian thực
- 📖 **Câu Chuyện Tình Yêu**: Timeline trực quan về hành trình yêu nhau
- 🗺️ **Bản Đồ Tích Hợp**: Google Maps cho hướng dẫn đến địa điểm
- 🖼️ **Album Ảnh**: Gallery ảnh cưới với lightbox
- 🎬 **Video**: Nhúng video pre-wedding từ YouTube/Vimeo
- 📱 **Mã QR**: QR code để chia sẻ website
- 💝 **Quà Mừng**: Hiển thị thông tin tài khoản ngân hàng và mã QR

### Tính Năng Tương Tác
- ✅ **RSVP**: Form xác nhận tham dự với các tùy chọn
- 💬 **Sổ Lời Chúc**: Khách mời có thể để lại những lời chúc
- 👨‍💼 **Bảng Quản Trị**: Dashboard để theo dõi danh sách khách và lời chúc

## 📁 Cấu Trúc Dự Án

```
project/
├── server/
│   ├── app.js                    # Express server chính
│   ├── routes/
│   │   └── wedding.js            # Routes cho website cưới
│   ├── controllers/
│   │   └── WeddingController.js   # Business logic
│   └── models/
│       └── WeddingModel.js        # Data models (JSON storage)
├── views/
│   ├── wedding-card.ejs          # Trang chính thiệp cưới
│   ├── admin.ejs                 # Bảng quản trị
│   └── error.ejs                 # Trang lỗi
├── public/
│   ├── css/
│   │   ├── style.css             # Style cho website cưới
│   │   └── admin.css             # Style cho bảng quản trị
│   └── js/
│       ├── main.js               # JavaScript cho website
│       └── admin.js              # JavaScript cho dashboard
├── data/
│   └── wedding.json              # Dữ liệu JSON (lưu trữ)
└── package.json                  # Dependencies
```

## 🚀 Cài Đặt & Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy server
```bash
npm start
```

Server sẽ chạy trên `http://localhost:3000`

### 3. Truy cập các trang
- **Website Thiệp Cưới**: `http://localhost:3000/`
- **Bảng Quản Trị**: `http://localhost:3000/admin`

## ⚙️ Cấu Hình

### Chỉnh Sửa Thông Tin Cưới

Mở file `data/wedding.json` và cập nhật các thông tin sau:

```json
{
  "couple": {
    "brideName": "Tên Cô Dâu",
    "groomName": "Tên Chú Rể",
    "parentsBride": { "father": "...", "mother": "..." },
    "parentsGroom": { "father": "...", "mother": "..." },
    "welcomeMessage": "Tin nhắn chào mừng"
  },
  "wedding": {
    "ceremonyDate": "YYYY-MM-DD",
    "ceremonyTime": "HH:MM",
    "ceremonyLocation": "Địa điểm lễ",
    "receptionDate": "YYYY-MM-DD",
    "receptionTime": "HH:MM",
    "receptionLocation": "Địa điểm tiệc",
    "receptionAddress": "Địa chỉ chi tiết",
    "coordinates": { "lat": 21.0000, "lng": 105.0000 }
  }
}
```

### Thêm Câu Chuyện Tình Yêu

Thêm các mục vào mảng `loveStory`:

```json
{
  "year": 2020,
  "title": "Tiêu đề",
  "description": "Mô tả chi tiết"
}
```

### Thêm Ảnh

Thêm các mục vào mảng `gallery`:

```json
{
  "url": "/path/to/image.jpg",
  "caption": "Mô tả ảnh"
}
```

## 📡 API Endpoints

### GET
- `GET /` - Trang chính website thiệp cưới
- `GET /admin` - Bảng quản trị

### POST
- `POST /api/rsvp` - Gửi xác nhận tham dự
- `POST /api/guestbook` - Gửi lời chúc
- `POST /api/couple-info` - Cập nhật thông tin cặp đôi (admin)
- `POST /api/wedding-details` - Cập nhật chi tiết lễ cưới (admin)

## 🎨 Tùy Chỉnh Giao Diện

Chỉnh sửa các biến CSS trong `public/css/style.css`:

```css
:root {
    --primary-color: #d4a5a5;      /* Màu chính */
    --secondary-color: #f5f5f5;    /* Màu phụ */
    --text-color: #333;             /* Màu chữ */
    --accent-gold: #d4af37;         /* Màu nhấn */
}
```

## 📱 Kiểm Tra Tương Thích

Thử nghiệm trên:
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Responsive trên các kích thước màn hình

## 🔒 Bảo Mật

- Lưu trữ dữ liệu trong file JSON (không có cơ sở dữ liệu)
- Không có xác thực admin hiện tại (thêm nếu cần)
- Tất cả dữ liệu được lưu cục bộ

## 📝 Ghi Chú

- Mã QR được tạo tự động cho website URL
- Countdown tự động cập nhật mỗi giây
- Hình ảnh gallery được hiển thị trong lightbox
- Phản hồi RSVP được lưu trong `data/wedding.json`

## 🤝 Hỗ Trợ & Phát Triển

Để thêm tính năng hoặc chỉnh sửa:

1. Chỉnh sửa file tương ứng
2. Cập nhật `data/wedding.json` nếu cần
3. Khởi động lại server: `npm start`

## 📄 License

MIT License
