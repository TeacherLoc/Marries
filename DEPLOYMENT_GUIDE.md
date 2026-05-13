# 🚀 HƯỚNG DẪN DEPLOY & TẠO QR CODE

Hướng dẫn chi tiết để deploy website và tạo QR code in trên thiệp cưới giấy.

---

## **BƯỚC 1: DEPLOY WEBSITE (Cloudflare Tunnel - Khuyên Dùng)**

### **Tại Sao Cloudflare Tunnel?**
✅ Miễn phí (Free)
✅ Không cần IP tĩnh
✅ HTTPS tự động
✅ Setup dễ (5 phút)
✅ URL đẹp và ổn định

---

## **BƯỚC 2: CÀI ĐẶT CLOUDFLARE TUNNEL**

### **Step 1: Cài Cloudflare CLI**
```bash
# Windows: Download tại https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
# Hoặc dùng npm:
npm install -g @cloudflare/wrangler

# Hoặc tải trực tiếp: https://github.com/cloudflare/cloudflared/releases
# Chọn: cloudflared-windows-amd64.msi
```

### **Step 2: Đăng Nhập Cloudflare**
```bash
cloudflared login

# Browser sẽ mở, đăng nhập/tạo tài khoản Cloudflare (miễn phí)
# Authorize cloudflared
```

### **Step 3: Chạy Tunnel**
```bash
# Terminal 1: Chạy server Node.js
npm start

# Terminal 2: Chạy tunnel
cloudflared tunnel --url http://localhost:3000

# Kết quả: 
# Your quick tunnel has been created! Visit it at (this will be temporary):
# https://random-string.trycloudflare.com
```

### **Step 4: (Tùy Chọn) Tạo Permanent Tunnel**
```bash
# Tạo tunnel có tên cố định
cloudflared tunnel create wedding-site

# Config: nano ~/.cloudflared/config.yml
tunnel: wedding-site
credentials-file: ~/.cloudflared/<UUID>.json
ingress:
  - hostname: wedding.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404

# Chạy tunnel
cloudflared tunnel run wedding-site

# Kết quả: https://wedding.yourdomain.com
```

---

## **BƯỚC 3: LẤY PUBLIC URL**

Sau khi chạy tunnel, bạn sẽ nhận được URL như:
```
https://abc123xyz.trycloudflare.com
hoặc
https://wedding.yourdomain.com (nếu tạo permanent)
```

**LƯU URL NÀY - ĐÂY LÀ LINK THIỆP CƯỚIof you**

---

## **BƯỚC 4: TẠO QR CODE**

### **Option 1: Online Generator (Nhanh nhất)**
1. Vào: https://www.qr-code-generator.com/
2. Paste URL: `https://abc123xyz.trycloudflare.com`
3. Click "Download" → Save as PNG/JPG
4. QR code ready!

### **Option 2: Command Line**
```bash
# Cài qrcode CLI
npm install -g qrcode-terminal

# Tạo QR code terminal
qrcode "https://abc123xyz.trycloudflare.com"

# Hoặc tạo file PNG
npm install -g qr-image
qr "https://abc123xyz.trycloudflare.com" > qr-code.png
```

### **Option 3: Trong Website (Tự động)**
URL thiệp đã có QR code tự động ở phần "Chia Sẻ Mời Cưới"

---

## **BƯỚC 5: IN QR CODE TRÊN THIỆP GIẤY**

### **Chuẩn Bị:**
1. ✅ Tải QR code (PNG/JPG)
2. ✅ Size QR code: 5cm x 5cm (tối thiểu) hoặc 10cm x 10cm (khuyên)
3. ✅ In trên kỹ thuật viên
4. ✅ Kiểm tra QR code có quét được không

### **In QR Code:**
```
File → Print → Chọn "QR code image" → Cài đặt kích thước
```

### **Vị Trí Trên Thiệp:**
- Góc dưới bên phải thiệp
- Hoặc giữa dưới thiệp
- **Có thể in thêm dòng chữ**: "Quét mã để xem thiệp cưới"

---

## **BƯỚC 6: TEST QR CODE**

### **Trước In:**
1. In 1 bản test trên giấy thường
2. Dùng **Camera hoặc Zalo** quét QR
3. Kiểm tra URL có mở website không
4. Test trên **iOS + Android**
5. Đảm bảo **toàn bộ website hoạt động tốt**

### **Checklist Test:**
- [ ] QR code quét được
- [ ] Website mở đúng
- [ ] Venue selector hiển thị (2 nút)
- [ ] Bản đồ cập nhật khi chọn tiệc
- [ ] RSVP form hoạt động
- [ ] Music player bật/tắt được
- [ ] Gallery hoạt động
- [ ] Admin dashboard xem được (http://localhost:3000/admin)

---

## **BƯỚC 7: IN HÀNG LOẠT**

Khi QR code test thành công:
1. Gửi QR code cho xưởng in
2. In lên thiệp cưới
3. Phân phát thiệp cho khách

---

## **BƯỚC 8: MONITOR VÀ MAINTAIN**

### **Sau Khi In Thiệp:**
```bash
# Keep cloudflared running
cloudflared tunnel run wedding-site

# Hoặc dùng PM2 để auto-restart
pm2 start cloudflared --name "tunnel" -- tunnel run wedding-site
```

### **Backup Dữ Liệu:**
```bash
# Backup daily
cp data/wedding.json backups/wedding-$(date +%Y%m%d).json
```

### **Monitor RSVP:**
- Truy cập: http://localhost:3000/admin
- Xem danh sách khách đã RSVP
- Export danh sách khách

---

## **TROUBLESHOOTING**

### **Problem: QR code không quét được**
**Solution:**
- Tăng size QR code lên 10cm x 10cm
- In lại trên chất lượng tốt
- Kiểm tra contrast (đen/trắng rõ)

### **Problem: Website không mở**
**Solution:**
- Check cloudflared có đang chạy không
- Kiểm tra terminal có lỗi gì
- Restart tunnel: `cloudflared tunnel run wedding-site`

### **Problem: Website chậm**
**Solution:**
- Kiểm tra internet connection
- Optimize ảnh (resize nhỏ hơn)
- Check server logs

### **Problem: RSVP không lưu**
**Solution:**
- Kiểm tra file `data/wedding.json` có write permission
- Check browser console (F12) có lỗi
- Restart server

---

## **SECURITY CHECKLIST**

- [ ] Cloudflare URL ổn định
- [ ] HTTPS enabled (tự động)
- [ ] Backup daily
- [ ] No sensitive data in code
- [ ] Admin dashboard hoạt động

---

## **NEXT STEPS (Sau Khi Deploy)**

1. **In thiệp & phát cho khách**
2. **Monitor RSVP** hàng ngày
3. **Tinh chỉnh web** dựa trên feedback
4. **Thêm features** nếu cần:
   - Email notifications
   - SMS reminders
   - Payment gateway (tiền mừng)
   - Gallery uploads
5. **Tối ưu UI/UX** dựa trên user behavior

---

## **TIMELINE RECOMMENDED**

```
Day 1:  Deploy website ← YOU ARE HERE
        Create QR code
        Print test

Day 2:  Test QR code
        Fix issues

Day 3-4: In hàng loạt
         Phát thiệp

Day 5+: Monitor RSVP
        Fine-tune website
        Add features nếu cần
```

---

## **QUICK REFERENCE**

### **Server Chạy:**
```bash
npm start
# http://localhost:3000
```

### **Tunnel Chạy:**
```bash
cloudflared tunnel run wedding-site
# https://your-url.com
```

### **Admin Dashboard:**
```
https://your-url.com/admin
```

### **Database Location:**
```
data/wedding.json
```

---

**✨ Ready to deploy! 🎉**

Hãy backup tất cả data trước khi deploy!
