/* ============================================
   MAIN PAGE JAVASCRIPT
   ============================================ */

const generateQRBtn = document.getElementById('generateQRBtn');
const scanQRBtn = document.getElementById('scanQRBtn');
const qrContainer = document.getElementById('qrContainer');
const scannerContainer = document.getElementById('scannerContainer');
const downloadQRBtn = document.getElementById('downloadQRBtn');
const closeQRBtn = document.getElementById('closeQRBtn');
const stopScanBtn = document.getElementById('stopScanBtn');
const videoScanner = document.getElementById('videoScanner');
const canvasScanner = document.getElementById('canvasScanner');

let scanningActive = false;

// Generate QR Code
generateQRBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/qrcode/generate');
    const data = await response.json();

    if (data.success) {
      const qrCodeDiv = document.getElementById('qrCode');
      const qrUrlP = document.getElementById('qrUrl');

      qrCodeDiv.innerHTML = '';
      qrCodeDiv.innerHTML = `<img src="${data.qrCode}" alt="QR Code" style="width: 300px; height: 300px;" />`;
      qrUrlP.textContent = data.weddingUrl;

      qrContainer.classList.remove('hidden');
      window.qrCodeDataUrl = data.qrCode;
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    alert('Lỗi tạo mã QR');
  }
});

// Download QR Code
downloadQRBtn.addEventListener('click', () => {
  if (window.qrCodeDataUrl) {
    const link = document.createElement('a');
    link.href = window.qrCodeDataUrl;
    link.download = 'wedding-qrcode.png';
    link.click();
  }
});

// Close QR Container
closeQRBtn.addEventListener('click', () => {
  qrContainer.classList.add('hidden');
});

// Scan QR Code
scanQRBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    videoScanner.srcObject = stream;
    scannerContainer.classList.remove('hidden');
    scanningActive = true;

    scanQRCode();
  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Không thể truy cập camera');
  }
});

// Stop Scanning
stopScanBtn.addEventListener('click', () => {
  stopScanning();
});

// Scan QR Code Loop
function scanQRCode() {
  if (!scanningActive) return;

  const context = canvasScanner.getContext('2d');
  canvasScanner.width = videoScanner.videoWidth;
  canvasScanner.height = videoScanner.videoHeight;

  context.drawImage(videoScanner, 0, 0);

  const imageData = context.getImageData(
    0,
    0,
    canvasScanner.width,
    canvasScanner.height
  );

  const code = jsQR(imageData.data, imageData.width, imageData.height);

  if (code) {
    const qrUrl = code.data;
    stopScanning();
    window.location.href = qrUrl;
  } else {
    requestAnimationFrame(scanQRCode);
  }
}

// Stop Scanning
function stopScanning() {
  scanningActive = false;
  const stream = videoScanner.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(track => track.stop());
  scannerContainer.classList.add('hidden');
}

// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
