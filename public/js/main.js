// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('<%= wedding.ceremonyDate %>T<%= wedding.ceremonyTime %>:00').getTime();

    function countdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('countdown').innerHTML = '<p style="text-align: center; font-size: 1.5rem;">Cảm ơn vì đã tham dự!</p>';
        }
    }

    countdown();
    setInterval(countdown, 1000);
}

// Gallery Lightbox
let currentImageIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item img');

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    currentImageIndex = index;
    lightboxImage.src = galleryItems[index].src;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex >= galleryItems.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = galleryItems.length - 1;

    document.getElementById('lightbox-image').src = galleryItems[currentImageIndex].src;
}

// RSVP Form Submission
document.getElementById('rsvp-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert('Cảm ơn bạn đã xác nhận tham dự!');
            e.target.reset();
        } else {
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi kết nối. Vui lòng thử lại.');
    }
});

// Guestbook Form Submission
document.getElementById('guestbook-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/guestbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert('Cảm ơn lời chúc của bạn!');
            e.target.reset();
            // Reload to show new entry
            setTimeout(() => location.reload(), 1000);
        } else {
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi kết nối. Vui lòng thử lại.');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
});

// Close lightbox when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
