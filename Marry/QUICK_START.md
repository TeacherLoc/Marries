## 🚀 HƯỚNG DẪN NHANH - Quick Start Guide

### ✅ Đã Hoàn Thành

Dự án **Marry - Thiệp Cưới Online QR Code** đã được thiết kế và xây dựng thành công với kiến trúc **MVC** hoàn chỉnh.

---

## 📦 Cài Đặt

```bash
cd d:\Marry
npm install
npm start
```

🌐 **Server chạy tại**: `http://localhost:3000`

---

## 🎯 Các Trang Chính

| Page | URL | Mô Tả |
|------|-----|-------|
| 🏠 Trang Chủ | `http://localhost:3000/` | Tạo & Quét QR Code |
| 💒 Thiệp Cưới | `http://localhost:3000/wedding/wedding-001` | Thiệp cưới online với mọi thông tin |
| ⚙️ Admin | `http://localhost:3000/admin` | Quản lý RSVP, Lời chúc, Thống kê |

---

## 📋 Các Tính Năng

### 🏠 **Trang Chủ** - Home Page
✅ Tạo mã QR cho thiệp cưới  
✅ Quét mã QR từ camera  
✅ Hướng dẫn sử dụng  
✅ Giới thiệu 6 tính năng chính  

### 💒 **Thiệp Cưới Online** - Single Page (Tất cả phần trên 1 trang)
✅ **Chúng Tôi**: Ảnh cợi & câu chuyện yêu thương  
✅ **Sự Kiện**: Lễ cưới + Tiệc cưới (ngày giờ địa điểm)  
✅ **Thư Viện Ảnh**: Gallery 4 ảnh  
✅ **Thông Tin Khách**: Trang phục, Hạn chế thực phẩm, Ghi chú  
✅ **Sổ Lời Chúc**: Form + Danh sách lời chúc  
✅ **RSVP**: Form + Thống kê real-time  
✅ **Danh Sách Quà**: Grid hiển thị quà tặng  
✅ **Bản Đồ**: Google Maps (tùy chọn)  

### ⚙️ **Admin Dashboard**
✅ Dashboard: 4 thẻ hiển thị chỉ số  
✅ Thống Kê: Bảng chi tiết  
✅ RSVP: Danh sách RSVP đầy đủ  
✅ Lời Chúc: Hiển thị tất cả lời chúc  

---

## 🏗️ Kiến Trúc MVC

```
📁 server/
  ├── app.js                      # Main Express
  ├── 📂 models/
  │   └── WeddingModel.js         # Data management
  ├── 📂 controllers/
  │   └── WeddingController.js    # Business logic
  ├── 📂 routes/
  │   └── wedding.js              # API routes
  └── 📂 middleware/
      └── (optional)

📁 views/
  ├── index.ejs                   # Home page
  ├── wedding-card.ejs            # Wedding card
  ├── admin.ejs                   # Admin dashboard
  └── error.ejs                   # Error page

📁 public/
  ├── 📂 css/                     # Stylesheets
  ├── 📂 js/                      # Frontend scripts
  └── 📂 images/                  # Assets

📁 data/
  └── wedding.json                # Local data
```

---

## 🔌 API Endpoints

```javascript
// QR Code & Wedding Card
GET  /wedding/:id                    // Xem thiệp cưới
GET  /api/qrcode/generate           // Tạo mã QR

// Messages (Lời Chúc)
POST /api/messages/add              // Gửi lời chúc
GET  /api/messages                  // Lấy danh sách

// RSVP
POST /api/rsvp/submit               // Gửi RSVP
GET  /api/rsvp/list                 // Lấy danh sách

// Gifts
GET  /api/gifts                     // Lấy danh sách quà

// Statistics
GET  /api/statistics                // Lấy thống kê
```

---

## 📝 Chỉnh Sửa Dữ Liệu

Tất cả dữ liệu nằm trong **`data/wedding.json`**

### Thay đổi Thông Tin Cặp Đôi
```json
{
  "couple": {
    "brideName": "Thảo Vy",
    "groomName": "Minh Anh",
    "story": "Câu chuyện yêu thương...",
    "weddingDate": "2024-06-15"
  }
}
```

### Thêm Ảnh
1. Đặt ảnh vào `public/images/`
2. Update đường dẫn trong `wedding.json`

### Thêm Quà Tặng
```json
{
  "id": 1,
  "name": "Tủ lạnh",
  "price": "15000000 VND",
  "purchased": false
}
```

---

## 🛠️ Công Nghệ

- **Backend**: Node.js + Express.js
- **Frontend**: HTML + CSS + Vanilla JavaScript
- **Templating**: EJS
- **Data**: JSON (Local)
- **QR Code**: qrcode npm package
- **QR Scanner**: jsQR library
- **Maps**: Google Maps API (optional)

---

## 🔐 Security Features

✅ XSS Protection (HTML escaping)  
✅ Input validation  
✅ Error handling  
✅ CORS ready  

---

## 📱 Responsive Design

✅ Mobile-first approach  
✅ Tested on all screen sizes  
✅ Touch-friendly buttons  
✅ Responsive grid layouts  

---

## 🌟 Tính Năng Nổi Bật

### 1. **QR Code Generation**
- Tạo mã QR động chứa link thiệp cưới
- Tải mã QR về hoặc in ra

### 2. **QR Code Scanner**
- Quét mã QR từ camera
- Tự động chuyển hướng đến thiệp cưới

### 3. **Single Page Wedding Card**
- Tất cả thông tin trên 1 trang
- Smooth scrolling navigation
- Responsive design

### 4. **Guest Interaction**
- RSVP submission
- Guest book (lời chúc)
- Real-time statistics

### 5. **Admin Dashboard**
- Monitor RSVP responses
- View guest messages
- Track statistics

---

## 🚀 Deployment

### **Local Testing**
```bash
npm start
# Visit: http://localhost:3000
```

### **Production (Heroku)**
```bash
heroku create marry-app
git push heroku main
```

### **Khác (DigitalOcean, AWS, etc.)**
```bash
npm install
npm start
```

---

## 🎓 Bạn Đã Học Được

✅ MVC Architecture  
✅ Express.js & Node.js  
✅ EJS Templating Engine  
✅ RESTful API Design  
✅ QR Code Technology  
✅ Responsive Web Design  
✅ Form Handling & Validation  
✅ Local Data Management  
✅ Frontend-Backend Integration  
✅ Real-time Data Updates  

---

## 📞 Troubleshooting

### **Port Already in Use**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Module Not Found**
```bash
npm install
npm install --save-dev nodemon
```

### **Camera Not Working**
- Check browser permissions
- Use HTTPS (required for some browsers)

### **QR Code Not Scanning**
- Use good lighting
- Ensure QR code is clear
- Check browser console for errors

---

## 📂 File Structure Recap

```
Marry/
├── server/                  # Backend (MVC)
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── app.js
├── public/                  # Frontend static
│   ├── css/
│   ├── js/
│   └── images/
├── views/                   # HTML templates (EJS)
├── data/                    # JSON data storage
├── package.json
├── .env
└── README.md
```

---

## 🎉 Hoàn Thành!

Dự án **Marry** đã sẵn sàng:

✅ MVC Architecture thiết kế hoàn hảo  
✅ 3 trang chính: Home, Wedding Card, Admin  
✅ QR Code generation & scanning  
✅ RSVP & Guest Book  
✅ Real-time statistics  
✅ Responsive design  
✅ Local JSON data storage  

---

## 📖 Tài Liệu Thêm

- 📄 `README.md` - Documentation đầy đủ
- 📄 `PROJECT_STRUCTURE.md` - Chi tiết cấu trúc
- 📝 `data/wedding.json` - Template dữ liệu

---

## 👨‍💻 So Sánh với Các Framework

| Feature | Marry | Next.js | Gatsby | Laravel |
|---------|-------|---------|--------|---------|
| Setup | ⭐ Dễ | ⭐⭐ Trung bình | ⭐⭐ Trung bình | ⭐⭐⭐ Phức tạp |
| Learning Curve | ⭐ Dễ | ⭐⭐ Trung bình | ⭐⭐ Trung bình | ⭐⭐⭐ Khó |
| Performance | ⭐⭐ Tốt | ⭐⭐⭐ Xuất sắc | ⭐⭐⭐ Xuất sắc | ⭐⭐ Tốt |
| Scalability | ⭐⭐ Có | ⭐⭐⭐ Rất tốt | ⭐⭐⭐ Rất tốt | ⭐⭐ Có |

---

## 🎯 Bước Tiếp Theo (Future Enhancements)

1. 🔄 Thêm database (MySQL, MongoDB)
2. 👥 User authentication
3. 💳 Payment integration
4. 📧 Email notifications
5. 📱 Mobile app (React Native)
6. 🌍 Multi-language support
7. 🎨 Theme customization
8. 📊 Advanced analytics

---

**🎊 Congratulations! Your Wedding Card App is Ready!**

Hãy truy cập: **http://localhost:3000** để bắt đầu!

---

*Created with ❤️ for Marry App | Version 1.0.0 | 2024*
