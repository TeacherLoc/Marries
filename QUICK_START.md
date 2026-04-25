# 🚀 Quick Start Guide

## Bước 1: Cài Đặt

```bash
npm install
```

## Bước 2: Chạy Server

```bash
npm start
```

Truy cập: `http://localhost:3000`

## Bước 3: Chỉnh Sửa Thông Tin Cưới

Mở file `data/wedding.json` và cập nhật:

- `couple.brideName` - Tên cô dâu
- `couple.groomName` - Tên chú rể
- `wedding.ceremonyDate` - Ngày lễ
- `wedding.ceremonyTime` - Giờ lễ
- `wedding.receptionLocation` - Địa điểm tiệc
- Các thông tin khác

## Bước 4: Truy Cập

- **Thiệp Cưới**: `http://localhost:3000`
- **Quản Trị**: `http://localhost:3000/admin`

## Các Tính Năng Sẵn Sàng

✅ Thiết kế responsive mobile-first
✅ Countdown đến ngày cưới
✅ Form RSVP
✅ Sổ lời chúc
✅ Bảng quản trị
✅ Mã QR
✅ Tích hợp Google Maps
✅ Album ảnh (lightbox)

## Để Thêm Nội Dung

### Thêm Ảnh

Đặt ảnh vào folder `public/` (hoặc dùng URL), sau đó thêm vào `data/wedding.json`:

```json
"gallery": [
  {"url": "/path/to/image1.jpg", "caption": "Ảnh 1"},
  {"url": "/path/to/image2.jpg", "caption": "Ảnh 2"}
]
```

### Thêm Video

Cập nhật link YouTube/Vimeo trong `data/wedding.json`:

```json
"preWeddingVideo": "https://www.youtube.com/embed/VIDEO_ID"
```

### Thêm Câu Chuyện Yêu

```json
"loveStory": [
  {
    "year": 2020,
    "title": "Gặp Gỡ",
    "description": "Chi tiết câu chuyện..."
  }
]
```

## Troubleshooting

**Server không chạy?**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
npm start
```

**Port 3000 đã được sử dụng?**
```bash
PORT=3001 npm start
```

## Hỏi Đáp

- Q: Làm sao để tùy chỉnh màu sắc?
  A: Chỉnh sửa `public/css/style.css` - phần `:root` { ... }

- Q: Dữ liệu lưu ở đâu?
  A: Tất cả lưu trong `data/wedding.json`

- Q: Có cần database không?
  A: Không, project sử dụng JSON file

Vui lòng tham khảo README.md cho thông tin chi tiết hơn!
