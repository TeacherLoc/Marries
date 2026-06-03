// ===== VENUE SELECTOR =====
let selectedVenue = 'bride'; // Default venue
const ENVELOPE_HIDE_DELAY = 2500;

function selectVenue(venue) {
    selectedVenue = venue;
    const selector = document.getElementById('venue-selector');

    if (!selector) return;

    // Add selecting class to trigger animations
    selector.classList.add('selecting');

    // Find and mark the selected button
    const buttons = selector.querySelectorAll('.venue-btn');
    buttons.forEach(btn => {
        if ((venue === 'groom' && btn.classList.contains('groom-venue')) ||
            (venue === 'bride' && btn.classList.contains('bride-venue'))) {
            btn.classList.add('selected');
        }
    });

    // After animation, hide selector and show landing
    setTimeout(() => {
        const landing = document.getElementById('landing');
        if (landing) {
            landing.classList.add('visible');
        }

        // Hide selector after landing is visible
        setTimeout(() => {
            selector.classList.add('hidden');
        }, 100);
    }, 1200);

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
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const dateStr = countdownEl.getAttribute('data-date');
    const timeStr = countdownEl.getAttribute('data-time') || '00:00';
    const weddingDate = new Date(`${dateStr}T${timeStr}:00`).getTime();

    function countdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownEl.style.display = 'grid';

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            countdownEl.style.display = 'flex';
            countdownEl.style.justifyContent = 'center';
            countdownEl.innerHTML = '<p class="countdown-thanks"><span class="heart">❤️</span><span class="text">Cảm ơn vì đã tham dự!</span><span class="heart">❤️</span></p>';
        }
    }

    countdown();
    setInterval(countdown, 1000);
}

// ===== BUTTERFLY FOLLOW =====
function initButterflyFollow() {
    const butterfly = document.getElementById('butterfly');
    if (!butterfly) return;

    let targetX = window.innerWidth * 0.7;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;
    let orbitAngle = 0;
    let wander = Math.random() * Math.PI * 2;
    let wobble = Math.random() * Math.PI * 2;

    const orbitRadius = 26;
    const orbitYScale = 0.65;
    const followEase = 0.055;
    const halfW = 21;
    const halfH = 17;

    function setTargetFromEvent(evt) {
        const point = evt.touches ? evt.touches[0] : evt;
        if (!point) return;
        targetX = point.clientX;
        targetY = point.clientY;
    }

    document.addEventListener('pointermove', setTargetFromEvent, { passive: true });
    document.addEventListener('touchmove', setTargetFromEvent, { passive: true });

    let lastTime = performance.now();

    function animate(now) {
        const dt = Math.min(40, now - lastTime);
        lastTime = now;

        orbitAngle += dt * 0.0036;
        wander += dt * 0.0015;
        wobble += dt * 0.0022;

        currentX += (targetX - currentX) * followEase;
        currentY += (targetY - currentY) * followEase;

        const radiusJitter = 0.65 + Math.sin(wander * 0.9) * 0.35 + Math.cos(wobble * 1.4) * 0.15;
        const orbitX = Math.cos(orbitAngle + Math.sin(wobble) * 0.4) * orbitRadius * radiusJitter;
        const orbitY = Math.sin(orbitAngle + Math.cos(wander) * 0.35) * orbitRadius * orbitYScale * radiusJitter;
        const driftX = Math.cos(wander * 1.3) * 10 + Math.sin(wobble * 1.7) * 6;
        const driftY = Math.sin(wander * 1.1) * 8 + Math.cos(wobble * 1.5) * 5;

        const x = currentX + orbitX + driftX - halfW;
        const y = currentY + orbitY + driftY - halfH;
        const tilt = Math.sin(orbitAngle) * 16 + Math.cos(wobble) * 6;

        butterfly.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
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

// ===== EDITORIAL GALLERY & FILTERS =====
function initEditorialGallery() {
    const galleryRoot = document.querySelector('.gallery-editorial');
    if (!galleryRoot) {
        return;
    }

    const items = Array.from(galleryRoot.querySelectorAll('.editorial-item'));
    const filterBtns = document.querySelectorAll('.filter-btn');
    const paginationEl = document.querySelector('.gallery-pagination');

    let currentFilter = 'all';
    let currentPage = 0;
    let perPage = 3;
    let visibleItems = items;

    const pagePresets = [
        {
            vectors: [
                { x: -34, y: 22 },
                { x: 22, y: 28 },
                { x: 0, y: 40 },
                { x: -18, y: 26 },
                { x: 28, y: 18 },
                { x: 10, y: 34 }
            ],
            duration: 520,
            delayBase: 70
        },
        {
            vectors: [
                { x: 30, y: 18 },
                { x: -26, y: 30 },
                { x: 14, y: 36 },
                { x: -14, y: 20 },
                { x: 26, y: 24 },
                { x: -30, y: 14 }
            ],
            duration: 620,
            delayBase: 90
        },
        {
            vectors: [
                { x: 0, y: 44 },
                { x: 20, y: 34 },
                { x: -20, y: 34 },
                { x: 16, y: 22 },
                { x: -16, y: 22 },
                { x: 0, y: 30 }
            ],
            duration: 700,
            delayBase: 110
        },
        {
            vectors: [
                { x: 25, y: -25 },
                { x: -25, y: -25 },
                { x: 25, y: 25 },
                { x: -25, y: 25 },
                { x: 0, y: 35 },
                { x: 0, y: -35 }
            ],
            duration: 650,
            delayBase: 80
        }
    ];

    const getPerPage = () => (window.innerWidth <= 768 ? 3 : 6);

    const buildDots = (count) => {
        if (!paginationEl) {
            return;
        }

        paginationEl.innerHTML = '';
        for (let i = 0; i < count; i += 1) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Trang ${i + 1}`);
            dot.addEventListener('click', () => {
                setPage(i);
            });
            paginationEl.appendChild(dot);
        }
    };

    const updateDots = () => {
        if (!paginationEl) {
            return;
        }
        const dots = Array.from(paginationEl.querySelectorAll('.gallery-dot'));
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === currentPage);
        });
    };

    const applyPage = () => {
        const preset = pagePresets[currentPage % pagePresets.length];
        const previousHeight = galleryRoot.offsetHeight;
        if (previousHeight) {
            galleryRoot.style.minHeight = `${previousHeight}px`;
        }

        visibleItems.forEach(item => {
            item.classList.add('is-paged-hidden');
            item.classList.remove('is-visible');
        });

        const start = currentPage * perPage;
        const pageItems = visibleItems.slice(start, start + perPage);

        pageItems.forEach((item, index) => {
            const vector = preset.vectors[index % preset.vectors.length];
            const rotation = item.dataset.revealRotation || 0;
            item.classList.remove('is-paged-hidden');
            item.style.setProperty('--reveal-delay', `${index * preset.delayBase}ms`);
            item.style.setProperty('--fly-x', `${vector.x}px`);
            item.style.setProperty('--fly-y', `${vector.y}px`);
            item.style.setProperty('--fly-rot', `${rotation}deg`);
            item.style.setProperty('--reveal-duration', `${preset.duration}ms`);
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                pageItems.forEach(item => item.classList.add('is-visible'));
            });
        });

        const totalDuration = preset.duration + (pageItems.length * preset.delayBase);
        if (previousHeight) {
            setTimeout(() => {
                galleryRoot.style.minHeight = '';
            }, totalDuration);
        }

        updateDots();
    };

    const setPage = (pageIndex) => {
        const pageCount = Math.max(1, Math.ceil(visibleItems.length / perPage));
        currentPage = Math.min(Math.max(pageIndex, 0), pageCount - 1);
        applyPage();
    };

    const updateVisibleItems = () => {
        visibleItems = items.filter(item => {
            const category = item.getAttribute('data-category') || 'all';
            return currentFilter === 'all' || category === currentFilter;
        });

        perPage = getPerPage();
        const pageCount = Math.max(1, Math.ceil(visibleItems.length / perPage));
        currentPage = 0;
        buildDots(pageCount);
        applyPage();
    };

    const handleSwipe = () => {
        let startX = 0;
        let startY = 0;

        galleryRoot.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });

        galleryRoot.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) {
                return;
            }

            if (deltaX < 0) {
                setPage(currentPage + 1);
            } else {
                setPage(currentPage - 1);
            }
        }, { passive: true });
    };

    const applyFilter = (filterValue) => {
        currentFilter = filterValue;
        updateVisibleItems();
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            applyFilter(filterValue);
        });
    });

    updateVisibleItems();
    handleSwipe();

    window.addEventListener('resize', () => {
        const nextPerPage = getPerPage();
        if (nextPerPage !== perPage) {
            updateVisibleItems();
        }
    });
}


// Gallery Lightbox
let currentImageIndex = 0;
let lightboxImages = [];

function getVisibleGalleryImages() {
    return Array.from(document.querySelectorAll('.editorial-item:not(.is-filtered-out):not(.is-paged-hidden) img'))
        .filter(img => img.getAttribute('src'));
}

function setLightboxImage(index) {
    const lightboxImage = document.getElementById('lightbox-image');
    if (!lightboxImage || lightboxImages.length === 0) {
        return;
    }

    if (index >= lightboxImages.length) currentImageIndex = 0;
    if (index < 0) currentImageIndex = lightboxImages.length - 1;

    lightboxImage.src = lightboxImages[currentImageIndex].src;
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    currentImageIndex = index;
    setLightboxImage(currentImageIndex);
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;
    setLightboxImage(currentImageIndex);
}

document.addEventListener('click', (event) => {
    const targetImage = event.target.closest('.gallery-editorial img');
    if (!targetImage) {
        return;
    }

    event.preventDefault();
    lightboxImages = getVisibleGalleryImages();
    const index = lightboxImages.indexOf(targetImage);
    openLightbox(index >= 0 ? index : 0);
});

document.querySelector('.lightbox .close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => changeLightboxImage(-1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => changeLightboxImage(1));

document.getElementById('lightbox')?.addEventListener('click', (event) => {
    if (event.target.id === 'lightbox') {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) {
        return;
    }

    if (event.key === 'Escape') {
        closeLightbox();
    }
    if (event.key === 'ArrowLeft') {
        changeLightboxImage(-1);
    }
    if (event.key === 'ArrowRight') {
        changeLightboxImage(1);
    }
});

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
        initButterflyFollow();
        // Music player disabled on landing page
        // initMusicPlayer();

        // Initialize gallery layouts
        if (document.querySelector('.gallery-editorial')) {
            initEditorialGallery();
        }

        if (document.querySelector('.gallery-swiper') && typeof Swiper !== 'undefined') {
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

// ===== LANDING PAGE FUNCTIONS =====
function openCard() {
    const landing = document.getElementById('landing');
    const card = document.getElementById('card');
    landing.classList.add('hide');
    card.style.display = 'block';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            card.classList.add('visible');
        });
    });
    setTimeout(() => {
        landing.style.display = 'none';
    }, 900);
}

// Spawn petals
(function spawnPetals() {
    const petalEl = document.getElementById('petals');
    if (!petalEl) return;

    const symbols = ['🌿', '✿', '❀', '🍃', '✦'];
    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.textContent = symbols[i % symbols.length];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.fontSize = (0.6 + Math.random() * 0.7) + 'rem';
        p.style.animationDuration = (7 + Math.random() * 9) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        petalEl.appendChild(p);
    }
})();
