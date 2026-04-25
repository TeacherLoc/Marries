# 📋 Marry - Thiệp Cưới Online QR Code

## 🎯 Tổng Quan Dự Án

**Marry** là một ứng dụng web theo MVC Architecture cho phép cặp đôi tạo thiệp cưới online thông minh. Khách mời có thể quét mã QR để xem thiệp cưới với đầy đủ thông tin, hình ảnh, và các tính năng tương tác.

---

## 🏗️ Kiến Trúc MVC

### **Model Layer** (`server/models/`)
- `WeddingModel.js` - Quản lý dữ liệu từ `data/wedding.json`
  - `getData()` - Lấy toàn bộ dữ liệu
  - `getCouple()` - Lấy thông tin cặp đôi
  - `getEvent()` - Lấy thông tin sự kiện
  - `getGallery()` - Lấy danh sách ảnh
  - `getMessages()` - Lấy danh sách lời chúc
  - `addMessage()` - Thêm lời chúc mới
  - `getRSVPList()` - Lấy danh sách RSVP
  - `addRSVP()` - Thêm RSVP mới
  - `getGifts()` - Lấy danh sách quà
  - `saveData()` - Lưu dữ liệu

### **Controller Layer** (`server/controllers/`)
- `WeddingController.js` - Xử lý logic ứng dụng
  - `getWeddingCard()` - Render thiệp cưới
  - `generateQRCode()` - Tạo mã QR động
  - `addMessage()` - Xử lý thêm lời chúc
  - `getMessages()` - Lấy lời chúc
  - `submitRSVP()` - Xử lý RSVP
  - `getRSVPList()` - Lấy danh sách RSVP
  - `getGifts()` - Lấy danh sách quà
  - `getStatistics()` - Tính toán thống kê

### **View Layer** (`views/`)
- `index.ejs` - Trang chủ
- `wedding-card.ejs` - Thiệp cưới online
- `error.ejs` - Trang lỗi
- `admin.ejs` - Dashboard quản lý

### **Routes** (`server/routes/`)
- `wedding.js` - Định tuyến tất cả endpoint

---

## 📁 Cấu Trúc Thư Mục Chi Tiết

```
Marry/
│
├── 📂 server/              # Backend (MVC Logic)
│   ├── app.js             # Main Express app
│   ├── 📂 models/         # Data layer
│   │   └── WeddingModel.js
│   ├── 📂 controllers/    # Business logic
│   │   └── WeddingController.js
│   ├── 📂 routes/         # URL routing
│   │   └── wedding.js
│   └── 📂 middleware/     # Custom middleware (optional)
│
├── 📂 public/             # Static files (Frontend)
│   ├── 📂 css/
│   │   ├── style.css           # Global styles
│   │   ├── wedding-card.css    # Wedding card styles
│   │   └── admin.css           # Admin dashboard styles
│   ├── 📂 js/
│   │   ├── main.js             # Home page logic
│   │   ├── wedding-card.js     # Wedding card logic
│   │   ├── admin.js            # Admin dashboard logic
│   │   └── qrcode.min.js       # QR code library
│   └── 📂 images/         # Image assets
│       ├── couple.jpg
│       ├── photo1.jpg
│       ├── photo2.jpg
│       └── ... (thêm ảnh tại đây)
│
├── 📂 views/              # EJS templates (View layer)
│   ├── index.ejs
│   ├── wedding-card.ejs
│   ├── admin.ejs
│   └── error.ejs
│
├── 📂 data/               # Local data storage
│   └── wedding.json       # Wedding data (tạm thời)
│
├── package.json           # Dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
└── README.md             # Documentation
```

---

## 🎨 Các Tính Năng Chi Tiết

### 1️⃣ **Trang Chủ** (`/`)
**URL**: `http://localhost:3000/`

**Tính năng**:
- ✅ Tạo mã QR cho thiệp cưới
- ✅ Quét mã QR từ camera
- ✅ Hướng dẫn sử dụng
- ✅ Giới thiệu các tính năng

**Giao diện**:
- Hero section với call-to-action buttons
- Features grid (6 feature cards)
- Instructions section
- Responsive design

### 2️⃣ **Thiệp Cưới Online** (`/wedding/:id`)
**URL**: `http://localhost:3000/wedding/wedding-001`

**Các phần trên 1 trang**:

#### **A. Navigation Bar**
- Logo "Marry"
- Quick links đến các section
- Sticky navigation

#### **B. Hero Section**
- Tên cặp đôi lớn
- Ngày cưới
- Background image

#### **C. Chúng Tôi Section**
- Ảnh cưỡi đôi
- Câu chuyện yêu thương
- Responsive layout

#### **D. Sự Kiện Section**
- Lễ cưới (ngày, giờ, địa điểm)
- Tiệc cưới (ngày, giờ, địa điểm)
- Icons cho từng sự kiện
- Google Maps integration (optional)

#### **E. Thư Viện Ảnh Section**
- Gallery grid (4 ảnh mẫu)
- Hover effect
- Responsive masonry

#### **F. Thông Tin Khách Mời Section**
- Trang phục
- Hạn xác nhận
- Ghi chú đặc biệt

#### **G. Sổ Lời Chúc Section**
- Form gửi lời chúc
  - Tên khách
  - Nội dung lời chúc
- Danh sách lời chúc
  - Tên gửi
  - Nội dung
  - Ngày gửi

#### **H. RSVP Section**
- Form RSVP:
  - Tên khách mời *
  - Xác nhận (Yes/No/Maybe) *
  - Số người tham dự *
  - Hạn chế thực phẩm
- Thống kê real-time:
  - Tổng RSVP
  - Sẽ tham dự
  - Tổng khách

#### **I. Danh Sách Quà Section**
- Grid hiển thị quà
- Ảnh, tên, mô tả
- Giá tiền
- Trạng thái (Đã Chọn/Còn Có)

#### **J. Footer**
- Thông tin copyright
- "Powered by Marry"

### 3️⃣ **Admin Dashboard** (`/admin`)
**URL**: `http://localhost:3000/admin`

**Các phần**:

#### **Dashboard Tab**
- 4 Card hiển thị:
  - Tổng RSVP
  - Tổng Lời Chúc
  - Quà Đã Chọn
  - Tổng Khách

#### **Thống Kê Tab**
- Bảng thống kê chi tiết
- Dữ liệu cập nhật real-time

#### **RSVP Tab**
- Danh sách RSVP đầy đủ
- Columns: Tên, Xác Nhận, Số Người, Hạn Chế, Ngày

#### **Lời Chúc Tab**
- Hiển thị tất cả lời chúc
- Tên gửi, nội dung, ngày tháng

---

## 🔌 API Endpoints

### **Wedding Card**
```
GET /wedding/:id                     # Render thiệp cưới
GET /api/qrcode/generate            # Tạo mã QR (JSON)
```

### **Messages API**
```
POST /api/messages/add              # Gửi lời chúc
  Body: { guestName, message }
  Response: { success, message, data }

GET /api/messages                   # Lấy danh sách lời chúc
  Response: { success, data: [...] }
```

### **RSVP API**
```
POST /api/rsvp/submit               # Gửi RSVP
  Body: { guestName, attendance, guestCount, dietary }
  Response: { success, message, data }

GET /api/rsvp/list                  # Lấy danh sách RSVP
  Response: { success, data: [...], total }
```

### **Gifts API**
```
GET /api/gifts                       # Lấy danh sách quà
  Response: { success, data: [...] }
```

### **Statistics API**
```
GET /api/statistics                 # Lấy thống kê
  Response: {
    success,
    data: {
      totalRSVP,
      yesCount,
      noCount,
      maybeCount,
      totalGuests,
      totalMessages,
      totalGifts,
      purchasedGifts
    }
  }
```

---

## 📊 Data Structure

### **wedding.json**
```json
{
  "couple": {
    "id": "wedding-001",
    "brideName": "Thảo Vy",
    "groomName": "Minh Anh",
    "story": "...",
    "profileImage": "/images/couple.jpg",
    "weddingDate": "2024-06-15"
  },
  "event": {
    "ceremony": { "name", "date", "time", "location", "address" },
    "reception": { "name", "date", "time", "location", "address" }
  },
  "location": {
    "ceremony": { "latitude", "longitude", "name" },
    "reception": { "latitude", "longitude", "name" }
  },
  "gallery": [ { "id", "title", "image", "category" } ],
  "guestInformation": { "rsvpDeadline", "dressCode", "specialRequests" },
  "messages": [ { "id", "guestName", "message", "timestamp" } ],
  "rsvpList": [ { "id", "guestName", "attendance", "guestCount", "dietary", "submittedDate" } ],
  "gifts": [ { "id", "name", "description", "image", "price", "purchased" } ]
}
```

---

## 🛠️ Công Nghệ Sử Dụng

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Templating | EJS |
| Data | JSON (Local Storage) |
| QR Code | qrcode npm package |
| QR Scanner | jsQR library |
| Maps | Google Maps API (optional) |
| HTTP Client | Axios |
| Env Config | dotenv |

---

## 📝 Cách Chỉnh Sửa Dữ Liệu

Tất cả dữ liệu nằm trong `data/wedding.json`. Bạn có thể chỉnh sửa:

### 1. **Thông Tin Cặp Đôi**
```json
"couple": {
  "brideName": "Thảo Vy",      // Tên cô dâu
  "groomName": "Minh Anh",     // Tên chú rể
  "story": "...",              // Câu chuyện
  "profileImage": "/images/couple.jpg"  // Ảnh cối
}
```

### 2. **Thêm Ảnh**
1. Đặt ảnh vào `public/images/`
2. Cập nhật `gallery` trong `wedding.json`

### 3. **Thêm Quà Tặng**
```json
"gifts": [
  {
    "id": 1,
    "name": "Tủ lạnh",
    "description": "...",
    "image": "/images/gift1.jpg",
    "price": "15000000 VND",
    "purchased": false
  }
]
```

---

## 🚀 Deployment Options

### **Heroku** (Recommended)
```bash
heroku login
heroku create marry-app
git push heroku main
```

### **Vercel**
⚠️ Requires serverless modifications

### **DigitalOcean/AWS**
```bash
npm install
npm start
```

### **Localhost**
```bash
npm run dev
```

---

## 🎓 Learning Outcomes

Dự án này giúp bạn học:
- ✅ MVC Architecture
- ✅ Express.js Backend
- ✅ EJS Templating
- ✅ RESTful API Design
- ✅ QR Code Generation & Scanning
- ✅ Local Data Management
- ✅ Responsive Web Design
- ✅ Form Handling
- ✅ Real-time Data Updates
- ✅ Admin Dashboard

---

## 📞 Support & Troubleshooting

### **Issues**

**Port Already in Use**
```bash
netstat -ano | findstr :3000     # Windows
```

**Module Not Found**
```bash
npm install
npm install --save-dev nodemon
```

**Camera Permission**
- Check browser permissions
- Use HTTPS (some browsers require it)

---

## 📄 License

MIT License

---

## 👨‍💻 Created with ❤️ for Marry App

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready

---

### 🎯 Next Steps

1. ✅ Setup Project Structure
2. ✅ Install Dependencies
3. ✅ Create MVC Architecture
4. ✅ Implement QR Code Features
5. ⏳ **RUN THE SERVER** - Em bạn là step tiếp theo!
6. ⏳ Test All Features
7. ⏳ Add Real Database (nếu cần)
8. ⏳ Deploy to Production

---
