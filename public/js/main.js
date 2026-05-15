// ===== VENUE SELECTOR =====
let selectedVenue = 'bride'; // Default venue
const ENVELOPE_HIDE_DELAY = 2500;

function selectVenue(venue) {
    selectedVenue = venue;
    const selector = document.getElementById('venue-selector');

    if (selector) {
        selector.classList.add('hidden');

        // Hide envelope after venue selection
        const envelope = document.getElementById('envelope-overlay');
        if (envelope) {
            setTimeout(() => {
                envelope.style.display = 'none';
            }, ENVELOPE_HIDE_DELAY);
        }
    }

    // Store selection
    sessionStorage.setItem('selectedVenue', venue);

    // Update map if visible
    updateMapForVenue(venue);
}
function initEnvelopeAnimation() {
    const envelope = document.getElementById('envelope-overlay');
    if (!envelope) return;

    envelope.addEventListener('click', () => {
        envelope.classList.remove('active');
        envelope.classList.add('closed');
        setTimeout(() => {
            envelope.style.display = 'none';
        }, ENVELOPE_HIDE_DELAY);
    });

    // Auto-close after 30 seconds
    setTimeout(() => {
        if (envelope.classList.contains('active')) {
            envelope.classList.remove('active');
            envelope.classList.add('closed');
            setTimeout(() => {
                envelope.style.display = 'none';
            }, ENVELOPE_HIDE_DELAY);
        }
    }, 30000);
}

// ===== MUSIC PLAYER =====
function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');

    if (!musicToggle || !backgroundMusic) return;

    // YouTube URL - extract video ID for embed player
    const youtubeUrl = 'https://www.youtube.com/watch?v=xFONPDwW-lU&list=RDxFONPDwW-lU&start_radio=1';
    const videoId = 'xFONPDwW-lU'; // Extract from URL

    // Create hidden YouTube embed for audio playback
    const youtubeEmbed = document.createElement('div');
    youtubeEmbed.id = 'youtube-player';
    youtubeEmbed.style.display = 'none';
    document.body.appendChild(youtubeEmbed);

    let isPlaying = false;
    let ytPlayer = null;
    let pendingAutoplay = false;

    function updateToggleState() {
        if (isPlaying) {
            musicToggle.textContent = '🎶';
            musicToggle.title = 'Tạm dừng';
            musicToggle.classList.add('playing');
        } else {
            musicToggle.textContent = '🎵';
            musicToggle.title = 'Phát nhạc';
            musicToggle.classList.remove('playing');
        }
    }

    function startPlayback() {
        if (!ytPlayer) {
            pendingAutoplay = true;
            return;
        }

        if (!isPlaying) {
            ytPlayer.playVideo();
            isPlaying = true;
            updateToggleState();
        }
    }

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    // YouTube Player Ready Callback
    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerReady(event) {
        if (pendingAutoplay) {
            pendingAutoplay = false;
            startPlayback();
        }
    }

    function onPlayerStateChange(event) {
        // Handle state changes
    }

    musicToggle.addEventListener('click', () => {
        if (!ytPlayer) {
            pendingAutoplay = true;
            return;
        }

        if (isPlaying) {
            ytPlayer.pauseVideo();
            isPlaying = false;
            updateToggleState();
        } else {
            ytPlayer.playVideo();
            isPlaying = true;
            updateToggleState();
        }
    });

    document.addEventListener('click', startPlayback, { once: true });
    document.addEventListener('touchstart', startPlayback, { once: true, passive: true });
    updateToggleState();

    // Alternative: Direct audio playback if user provides MP3 URL
    // Uncomment below to use direct audio URL instead
    /*
    backgroundMusic.src = 'YOUR_MP3_URL_HERE';

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            backgroundMusic.pause();
            musicToggle.textContent = '🎵';
            musicToggle.classList.remove('playing');
            isPlaying = false;
        } else {
            backgroundMusic.play().catch(err => console.log('Cannot autoplay audio:', err));
            musicToggle.textContent = '🎶';
            musicToggle.classList.add('playing');
            isPlaying = true;
        }
    });
    */
}

// ===== COUNTDOWN TIMER =====
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

            const countdownEl = document.getElementById('countdown');
            countdownEl.style.display = 'grid';

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            const countdownEl = document.getElementById('countdown');
            countdownEl.style.display = 'flex';
            countdownEl.style.justifyContent = 'center';
            countdownEl.innerHTML = '<p class="countdown-thanks"><span class="heart">❤️</span><span class="text">Cảm ơn vì đã tham dự!</span><span class="heart">❤️</span></p>';
        }
    }

    countdown();
    setInterval(countdown, 1000);
}

// ===== GALLERY SWIPER & FILTERS =====
function initGallerySwiper() {
    // Check if Swiper exists
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper not loaded');
        return;
    }

    const galleryRoot = document.querySelector('.gallery-swiper');
    if (!galleryRoot) {
        return;
    }

    const galleryWrapper = galleryRoot.querySelector('.swiper-wrapper');
    if (!galleryWrapper) {
        return;
    }

    const blockedImageSrc = new Set();
    const normalizeSrc = (src) => (src || '').trim();

    const allSlides = Array.from(galleryWrapper.querySelectorAll('.swiper-slide'))
        .map(slide => {
            const img = slide.querySelector('img');
            const imgSrc = img ? normalizeSrc(img.getAttribute('src')) : '';

            return {
                category: slide.getAttribute('data-category') || 'all',
                html: slide.outerHTML,
                imgSrc
            };
        })
        .filter(slide => slide.imgSrc);

    const gallerySwiper = new Swiper('.gallery-swiper', {
        loop: false,
        rewind: false,
        autoHeight: true,
        watchOverflow: true,
        slidesPerView: 1,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            imagesReady(swiper) {
                swiper.updateAutoHeight(0);
            },
            slideChangeTransitionEnd(swiper) {
                swiper.updateAutoHeight(0);
            }
        }
    });

    const removeSlideByElement = (slideEl) => {
        const index = Array.from(gallerySwiper.slides).indexOf(slideEl);
        if (index >= 0) {
            gallerySwiper.removeSlide(index);
        } else {
            slideEl.remove();
            gallerySwiper.update();
        }
    };

    const refreshSwipeState = () => {
        const slideCount = gallerySwiper.slides.length;
        gallerySwiper.allowTouchMove = slideCount > 1;
        gallerySwiper.allowSlideNext = slideCount > 1;
        gallerySwiper.allowSlidePrev = slideCount > 1;
    };

    const bindImageAutoHeight = () => {
        const galleryImages = galleryRoot.querySelectorAll('img');
        galleryImages.forEach(img => {
            if (img.dataset.galleryBound === '1') {
                return;
            }
            img.dataset.galleryBound = '1';

            const handleError = () => {
                const src = normalizeSrc(img.getAttribute('src'));
                if (src) {
                    blockedImageSrc.add(src);
                }

                const slideEl = img.closest('.swiper-slide');
                if (slideEl) {
                    removeSlideByElement(slideEl);
                    gallerySwiper.updateAutoHeight(0);
                    refreshSwipeState();
                }
            };

            if (img.complete) {
                if (img.naturalWidth === 0) {
                    handleError();
                }
                return;
            }

            img.addEventListener('load', () => {
                gallerySwiper.updateAutoHeight(0);
            }, { once: true });
            img.addEventListener('error', handleError, { once: true });
        });
    };

    bindImageAutoHeight();

    const applyGalleryFilter = (filterValue) => {
        const visibleSlides = allSlides.filter(slide => {
            if (blockedImageSrc.has(slide.imgSrc)) {
                return false;
            }
            return filterValue === 'all' || slide.category === filterValue;
        });

        gallerySwiper.removeAllSlides();
        if (visibleSlides.length > 0) {
            gallerySwiper.appendSlide(visibleSlides.map(slide => slide.html));
        }

        gallerySwiper.update();
        gallerySwiper.slideTo(0, 0);
        gallerySwiper.updateAutoHeight(0);
        refreshSwipeState();

        bindImageAutoHeight();
    };

    // Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            applyGalleryFilter(filterValue);
        });
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
    try {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                offset: 100,
                easing: 'ease-in-out-cubic',
                once: false,
                mirror: true
            });
        } else {
            console.warn('AOS library not loaded');
        }

        // Initialize animations
        initEnvelopeAnimation();
        initVenueSelector();
        updateCountdown();
        initMusicPlayer();

        // Wait for libraries to load
        if (typeof Swiper !== 'undefined') {
            setTimeout(() => {
                initGallerySwiper();
            }, 500);
        }

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

        console.log('✅ Wedding website initialized successfully!');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
});

// Close lightbox when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// ===== MAP UPDATE FOR VENUE =====
function updateMapForVenue(venue) {
    const mapFrame = document.querySelector('.map-container iframe');
    if (!mapFrame) return;

    let lat, lng;
    if (venue === 'bride') {
        lat = 10.9382941;
        lng = 106.6881491;
    } else {
        lat = 21.0285;
        lng = 105.8542;
    }

    mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

// ===== INIT VENUE SELECTOR =====
function initVenueSelector() {
    const selector = document.getElementById('venue-selector');
    if (!selector) return;

    // Check if venue was already selected
    const stored = sessionStorage.getItem('selectedVenue');
    if (stored) {
        selectVenue(stored);
    }
}
