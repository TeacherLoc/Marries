# Hướng Dẫn Thiết Lập và Chạy Dự Án

## 📋 Yêu Cầu
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

## 🚀 Cài Đặt

### 1. Cài Đặt Dependencies
```bash
npm install
```

### 2. Cấu Hình
Tạo file `.env` trong thư mục gốc (đã có sẵn) với các biến:
```
PORT=3000
NODE_ENV=development
HOST=localhost
```

### 3. Chạy Ứng Dụng

**Development Mode (Auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu Trúc Dự Án

```
marry/
├── server/
│   ├── models/           # Xử lý dữ liệu
│   │   └── WeddingModel.js
│   ├── controllers/      # Logic ứng dụng
│   │   └── WeddingController.js
│   ├── routes/          # Định tuyến
│   │   └── wedding.js
│   ├── middleware/      # Middleware
│   └── app.js           # File chính Express
├── public/
│   ├── css/            # CSS Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Hình ảnh
├── views/              # EJS templates
│   ├── index.ejs
│   ├── wedding-card.ejs
│   ├── error.ejs
│   └── admin.ejs
├── data/
│   └── wedding.json    # Dữ liệu mẫu (JSON)
├── package.json
├── .env
└── README.md
```

## 🎯 Các Tính Năng Chính

### 1. **Trang Chủ** (`http://localhost:3000/`)
- Tạo mã QR cho thiệp cưới
- Quét mã QR từ camera
- Hướng dẫn sử dụng

### 2. **Thiệp Cưới Online** (`http://localhost:3000/wedding/{id}`)
Bao gồm các phần:
- **Chúng Tôi**: Thông tin cặp đôi
- **Sự Kiện**: Lễ cưới và tiệc cưới
- **Thư Viện Ảnh**: Danh sách ảnh
- **Thông Tin Khách Mời**: Trang phục, hạn chế thực phẩm
- **Sổ Lời Chúc**: Ghi lời chúc
- **RSVP**: Xác nhận tham dự
- **Danh Sách Quà**: Danh sách quà tặng

### 3. **Admin Dashboard** (`http://localhost:3000/admin`)
- Xem thống kê
- Quản lý RSVP
- Xem lời chúc

## 🔌 API Endpoints

### Wedding Card
- `GET /wedding/:id` - Xem thiệp cưới
- `GET /api/qrcode/generate` - Tạo mã QR

### Messages
- `POST /api/messages/add` - Gửi lời chúc
- `GET /api/messages` - Lấy danh sách lời chúc

### RSVP
- `POST /api/rsvp/submit` - Gửi RSVP
- `GET /api/rsvp/list` - Lấy danh sách RSVP

### Gifts
- `GET /api/gifts` - Lấy danh sách quà

### Statistics
- `GET /api/statistics` - Lấy thống kê

## 📝 Chỉnh Sửa Dữ Liệu

Tất cả dữ liệu được lưu trong file `data/wedding.json`. Bạn có thể chỉnh sửa:
- Thông tin cặp đôi
- Chi tiết sự kiện
- Thư viện ảnh (đường dẫn hình ảnh)
- Thông tin khách mời

## 🗺️ Sử Dụng Google Maps

Để hiển thị bản đồ, bạn cần:
1. Lấy API Key từ [Google Cloud Console](https://console.cloud.google.com/)
2. Thay thế `YOUR_GOOGLE_MAPS_API_KEY` trong file `views/wedding-card.ejs`

## 📸 Thêm Hình Ảnh

1. Đặt hình ảnh vào thư mục `public/images/`
2. Cập nhật đường dẫn trong `data/wedding.json`

## 🔒 Security Notes

- XSS Protection: Tất cả input được escape
- CSRF: Cân nhắc thêm CSRF token cho production
- Rate Limiting: Cân nhắc thêm rate limiting

## 🚀 Triển Khai (Deployment)

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel/Netlify
Chuyển đổi sang serverless functions

### Server Riêng (DigitalOcean, AWS, v.v.)
```bash
npm install
npm start
```

## 📦 Packages Sử Dụng

- **Express**: Web framework
- **EJS**: Template engine
- **QRCode**: QR code generation
- **dotenv**: Environment variables
- **Axios**: HTTP client

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Thay đổi PORT trong .env hoặc
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # macOS/Linux
```

### Module Not Found
```bash
npm install
```

### Cannot Find Camera
- Kiểm tra quyền camera
- Sử dụng HTTPS (một số browser yêu cầu)

## 📧 Support

Nếu có vấn đề, vui lòng kiểm tra:
- Console log (F12)
- File `wedding.json`
- Cài đặt environment

---

**Created with ❤️ for Marry App**
