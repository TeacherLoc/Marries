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
            document.getElementById('countdown').innerHTML = '<p style="text-align: center; font-size: 1.5rem; animation: pulse 1s infinite;">❤️ Cảm ơn vì đã tham dự! ❤️</p>';
        }
    }

    countdown();
    setInterval(countdown, 1000);
}

// Smooth scrolling and scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
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

// RSVP Form Submission with animations
document.getElementById('rsvp-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;

    // Show loading state
    btn.disabled = true;
    btn.textContent = '⏳ Đang gửi...';

    const formData = new FormData(form);
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
            btn.textContent = '✓ Đã gửi thành công!';
            btn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';

            // Create success message with animation
            const successMsg = document.createElement('div');
            successMsg.textContent = '❤️ Cảm ơn bạn đã xác nhận tham dự!';
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #4caf50;
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 1rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideDown 0.5s ease-out;
            `;
            document.body.appendChild(successMsg);

            setTimeout(() => {
                successMsg.remove();
                form.reset();
                btn.disabled = false;
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        } else {
            btn.textContent = '✗ Lỗi - Thử lại';
            btn.style.background = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        btn.textContent = '✗ Lỗi kết nối';
        btn.style.background = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }
});

// Guestbook Form Submission with animations
document.getElementById('guestbook-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;

    // Show loading state
    btn.disabled = true;
    btn.textContent = '⏳ Đang gửi...';

    const formData = new FormData(form);
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
            btn.textContent = '✓ Đã gửi thành công!';
            btn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';

            // Create success message
            const successMsg = document.createElement('div');
            successMsg.textContent = '❤️ Cảm ơn lời chúc của bạn!';
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #4caf50;
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 1rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideDown 0.5s ease-out;
            `;
            document.body.appendChild(successMsg);

            setTimeout(() => {
                successMsg.remove();
                form.reset();
                btn.disabled = false;
                btn.textContent = originalText;
                btn.style.background = '';
                // Reload to show new entry with animation
                location.reload();
            }, 1500);
        } else {
            btn.textContent = '✗ Lỗi - Thử lại';
            btn.style.background = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    } catch (error) {
        console.error('Error:', error);
        btn.textContent = '✗ Lỗi kết nối';
        btn.style.background = 'linear-gradient(135deg, #f44336 0%, #da190b 100%)';
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    observeElements();

    // Add animation style for success message
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translate(-50%, -30px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Close lightbox when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
