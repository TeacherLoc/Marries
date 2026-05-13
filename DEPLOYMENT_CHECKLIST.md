# ✅ DEPLOYMENT & QR CODE CHECKLIST

## **PHASE 1: PRE-DEPLOYMENT (Hôm nay)**

### **Prepare Code**
- [x] Website hoàn chỉnh
- [x] Venue selector đã thêm
- [x] Testing trên localhost
- [ ] Backup `data/wedding.json`

### **Prepare Cloudflare**
- [ ] Download cloudflared từ https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
- [ ] Hoặc: `npm install -g @cloudflare/wrangler`
- [ ] Tạo tài khoản Cloudflare (miễn phí)

---

## **PHASE 2: DEPLOYMENT (Hôm nay/Ngày mai)**

### **Deploy Server**
- [ ] Terminal 1: `npm start` (hoặc `PORT=3000 npm start`)
- [ ] Verify: http://localhost:3000 mở được
- [ ] Venue selector hiển thị (2 nút)

### **Setup Tunnel**
- [ ] Terminal 2: `cloudflared login`
- [ ] Login Cloudflare
- [ ] `cloudflared tunnel --url http://localhost:3000`
- [ ] Lấy URL (ví dụ: https://abc123.trycloudflare.com)
- [ ] **Lưu URL này!**

### **Test Public URL**
- [ ] Truy cập URL public từ điện thoại
- [ ] Venue selector hoạt động
- [ ] Click vào tiệc nhà gái → bản đồ cập nhật
- [ ] Click vào tiệc nhà trai → bản đồ cập nhật
- [ ] RSVP form gửi được
- [ ] Admin dashboard xem được (`/admin`)

---

## **PHASE 3: QR CODE CREATION (Hôm nay)**

### **Generate QR Code**
- [ ] Vào https://www.qr-code-generator.com/
- [ ] Paste URL public: `https://your-url.com`
- [ ] Download QR code (PNG/JPG)
- [ ] **Size: 10cm x 10cm recommended**

### **Quality Check**
- [ ] QR code rõ (không mờ)
- [ ] Contrast tốt (đen/trắng rõ)
- [ ] Test quét bằng Camera (không dùng Messenger)
- [ ] Test trên iOS + Android
- [ ] URL mở đúng

---

## **PHASE 4: PRINT TEST (Ngày mai)**

### **Print Sample**
- [ ] In 1 bản test trên giấy A4 thường
- [ ] QR code size: 10cm x 10cm
- [ ] Vị trí: góc phải dưới thiệp

### **Test Scan**
- [ ] Dùng Camera native quét
- [ ] Hoặc Zalo camera quét
- [ ] Website mở đúng
- [ ] Toàn bộ feature hoạt động
- [ ] RSVP test: điền thử form
- [ ] Check `http://localhost:3000/admin` → có RSVP test

### **Fix Issues**
- [ ] Nếu QR không quét: tăng size lên 12-15cm
- [ ] Nếu website lỗi: fix trên localhost rồi redeploy
- [ ] Nếu RSVP không lưu: check `data/wedding.json` permissions

---

## **PHASE 5: PRINT INVITATIONS (3-5 ngày)**

### **Prepare for Print Shop**
- [ ] Gửi QR code image (.PNG/.JPG) cho xưởng in
- [ ] Xác nhận: size, vị trí, chất lượng in
- [ ] In sample lần cuối kiểm tra
- [ ] Phê duyệt in hàng loạt

### **Print**
- [ ] In toàn bộ thiệp
- [ ] Quality check: QR code quét được trên 10 thiệp random
- [ ] Phân loại & chuẩn bị phát

---

## **PHASE 6: DISTRIBUTION & MONITORING**

### **Before Distribution**
- [ ] Backup lại `data/wedding.json`
- [ ] Test website 1 lần cuối
- [ ] Ensure cloudflared đang chạy
- [ ] Note admin password (nếu có)

### **After Distribution**
- [ ] Keep cloudflared running 24/7
- [ ] Daily backup `data/wedding.json`
- [ ] Monitor RSVP count
- [ ] Check `/admin` dashboard regularly
- [ ] Respond to RSVP inquiries

### **Post-Wedding**
- [ ] Archive `data/wedding.json`
- [ ] Take down website (hoặc keep as memory)
- [ ] Export RSVP list to Excel

---

## **QUICK COMMANDS**

```bash
# Server (Terminal 1)
npm start

# Tunnel (Terminal 2)
cloudflared tunnel run wedding-site

# Admin Dashboard
http://localhost:3000/admin

# Backup
cp data/wedding.json backups/wedding-$(date +%Y%m%d).json

# Backup Windows
copy data\wedding.json backups\wedding-%date:~-4,4%%date:~-10,2%%date:~-7,2%.json
```

---

## **IMPORTANT NOTES**

⚠️ **BEFORE PRINTING**
- Test QR code at least 5 times
- Ensure website is 100% working
- Have backup of all data

⚠️ **KEEP RUNNING**
- Cloudflared must run 24/7 during event
- Server must stay online
- Have someone monitor `/admin`

⚠️ **BACKUP DAILY**
- Copy `data/wedding.json` daily
- Keep backup in 2 locations
- Archive after event

---

## **SUPPORT CONTACTS**

- **Cloudflare Help**: https://developers.cloudflare.com/
- **QR Code Issues**: https://www.qr-code-generator.com/help/
- **Server Issues**: Check logs, restart server

---

**YOU'RE READY TO DEPLOY! 🚀**

