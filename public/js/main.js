// ===== VENUE SELECTOR =====
let selectedVenue = 'bride'; // Default venue
const ENVELOPE_HIDE_DELAY = 2500;
let weddingConfig = null;

// ===== LOAD DYNAMIC CONFIG =====
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/wedding-data');
        if (response.ok) {
            const data = await response.json();
            if (data && data.wedding) {
                weddingConfig = data.wedding;
                // Cập nhật lại ngày dựa theo config ngay khi tải xong
                if (typeof updateDateForVenue === 'function') {
                    updateDateForVenue(selectedVenue);
                }
            }
        }
    } catch (error) {
        console.log('Sử dụng ngày mặc định do không lấy được cấu hình');
    }
});

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

    // Cập nhật ngày tháng dựa theo tiệc được chọn
    if (typeof updateDateForVenue === 'function') updateDateForVenue(venue);
}

window.selectVenue = selectVenue; // Khai báo toàn cục để chắc chắn HTML gọi được hàm này

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

    function countdown() {
        const dateStr = countdownEl.getAttribute('data-date');
        const timeStr = countdownEl.getAttribute('data-time') || '00:00';
        const weddingDate = new Date(`${dateStr}T${timeStr}:00`).getTime();

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

// ===== FLOATING HEART FOLLOW =====
function initFloatingHeart() {
    const heart = document.getElementById('floating-heart');
    if (!heart) return;

    let targetX = window.innerWidth * 0.7;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;
    let orbitAngle = 0;
    let wander = Math.random() * Math.PI * 2;
    let wobble = Math.random() * Math.PI * 2;

    const orbitRadius = 22;
    const orbitYScale = 0.7;
    const followEase = 0.06;
    const halfW = 22;
    const halfH = 20;

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

        orbitAngle += dt * 0.003;
        wander += dt * 0.0012;
        wobble += dt * 0.0018;

        currentX += (targetX - currentX) * followEase;
        currentY += (targetY - currentY) * followEase;

        const radiusJitter = 0.7 + Math.sin(wander * 0.8) * 0.3 + Math.cos(wobble * 1.3) * 0.12;
        const orbitX = Math.cos(orbitAngle + Math.sin(wobble) * 0.5) * orbitRadius * radiusJitter;
        const orbitY = Math.sin(orbitAngle + Math.cos(wander) * 0.4) * orbitRadius * orbitYScale * radiusJitter;
        const driftX = Math.cos(wander * 1.2) * 12 + Math.sin(wobble * 1.6) * 7;
        const driftY = Math.sin(wander * 1.0) * 10 + Math.cos(wobble * 1.4) * 6;

        const x = currentX + orbitX + driftX - halfW;
        const y = currentY + orbitY + driftY - halfH;
        const tilt = Math.sin(orbitAngle) * 12 + Math.cos(wobble) * 5;

        heart.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`;
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
    // Ép buộc dọn dẹp các nút EJS cũ bị sót lại (Tất cả, Lễ cưới...)
    document.querySelectorAll('[data-filter]').forEach(btn => {
        const val = btn.getAttribute('data-filter');
        if (val !== 'damhoi' && val !== 'damcuoi' && btn.parentElement) {
            btn.parentElement.classList.add('gallery-filters', 'filters');
            btn.parentElement.innerHTML = `
                <button class="filter-btn active" data-filter="damhoi">Đám Hỏi</button>
                <button class="filter-btn" data-filter="damcuoi">Đám Cưới</button>
            `;
        }
    });

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

    // Kích hoạt mặc định bộ lọc "Đám Hỏi"
    if (filterBtns.length > 0) {
        applyGalleryFilter('damhoi');
    }
}

// ===== EDITORIAL GALLERY & FILTERS =====
function initEditorialGallery() {
    const galleryRoot = document.querySelector('.gallery-editorial');
    if (!galleryRoot) {
        return;
    }

    const paginationEl = document.querySelector('.gallery-pagination');
        if (paginationEl) paginationEl.style.display = 'none';

        // 1. Khôi phục và cấu hình Nút Bộ Lọc (Đám Hỏi / Đám Cưới)
        let filterContainer = document.querySelector('.gallery-filters, .filters');
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.className = 'gallery-filters filters';
            galleryRoot.parentNode.insertBefore(filterContainer, galleryRoot);
        }
        
        // Ghi đè bắt buộc lại toàn bộ html nếu container đang chứa các nút cũ
        if (!filterContainer.querySelector('[data-filter="damcuoi"]')) {
            filterContainer.innerHTML = `
                <button class="filter-btn active" data-filter="damhoi">Đám Hỏi</button>
                <button class="filter-btn" data-filter="damcuoi">Đám Cưới</button>
            `;
        }

        const customFilterBtns = filterContainer.querySelectorAll('.filter-btn');
        customFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                customFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                const editorialItems = galleryRoot.querySelectorAll('.editorial-item');
                let visibleIndex = 0;
                
                editorialItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (category === filterValue) {
                        item.classList.remove('is-filtered-out');
                        item.style.animationDelay = `${(visibleIndex % 6) * 0.1}s`;
                        visibleIndex++;
                    } else {
                        item.classList.add('is-filtered-out');
                    }
                });
                // Cập nhật lại danh sách ảnh cho Lightbox (khi bấm phóng to)
                lightboxImages = getVisibleGalleryImages();
            });
    });

    // 2. Chèn CSS để định dạng lại layout 5-3-2-1 và thêm hiệu ứng
    if (!document.getElementById('custom-gallery-layout')) {
        const style = document.createElement('style');
        style.id = 'custom-gallery-layout';
        style.textContent = `
            .gallery-editorial {
                display: flex !important;
                flex-wrap: wrap !important;
                gap: 10px !important;
                justify-content: center !important;
                padding: 20px 0 !important;
                min-height: auto !important;
            }
                /* Styles cho nút bộ lọc */
                .gallery-filters { display: flex !important; justify-content: center !important; gap: 15px !important; margin-bottom: 25px !important; flex-wrap: wrap !important; }
                .filter-btn { padding: 8px 25px !important; border: 1px solid #d4a373 !important; background: transparent !important; color: #d4a373 !important; border-radius: 25px !important; cursor: pointer !important; font-weight: 500 !important; transition: all 0.3s ease !important; font-family: inherit !important; display: inline-block !important; }
                .filter-btn:hover { background: #fdf6f0 !important; }
                .filter-btn.active { background: #d4a373 !important; color: white !important; box-shadow: 0 4px 10px rgba(212,163,115,0.3) !important; }
            .editorial-item {
                position: relative !important;
                left: auto !important;
                top: auto !important;
                transform: none !important;
                opacity: 0;
                border-radius: 12px;
                overflow: hidden;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease !important;
                animation: fadeInScale 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                display: block !important;
            }
        .editorial-item.is-paged-hidden {
            display: block !important;
        }
        .editorial-item.is-filtered-out {
            display: none !important; /* Ẩn hoàn toàn nếu ảnh bị lọc (ví dụ: logo) */
            }
            .editorial-item:hover {
                transform: translateY(-8px) scale(1.02) !important;
                box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
                z-index: 10;
            }
            /* Bắt buộc các thẻ bọc (a, figure...) phải chiếm đủ 100% chiều cao */
            .editorial-item a,
            .editorial-item figure,
            .editorial-item > div {
                display: block !important;
                width: 100% !important;
                height: 100% !important;
            }
            .editorial-item img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                object-position: center 20% !important; /* Lùi xuống một chút để lấy ảnh cân đối hơn */
                background-color: transparent;
                transition: transform 0.6s ease;
                display: block;
            }
            .editorial-item:hover img {
                transform: scale(1.1);
            }
            /* Ẩn toàn bộ các dòng chữ (caption) dưới ảnh */
            .editorial-item p,
            .editorial-item span,
            .editorial-item figcaption,
            .editorial-item .caption,
            .editorial-item h1, .editorial-item h2, .editorial-item h3, .editorial-item h4 {
                display: none !important;
            }

            /* --- Bố cục luân phiên 6 ảnh (3-2-1) --- */
            /* Dòng 1: 3 ảnh */
            .editorial-item:nth-child(6n+1),
            .editorial-item:nth-child(6n+2),
            .editorial-item:nth-child(6n+3) {
                width: calc(33.333% - 6.66px) !important;
                height: 250px !important;
            }
            /* Dòng 2: 2 ảnh */
            .editorial-item:nth-child(6n+4),
            .editorial-item:nth-child(6n+5) {
                width: calc(50% - 5px) !important;
                height: 350px !important;
            }
            /* Dòng 3: 1 ảnh to */
            .editorial-item:nth-child(6n+6) {
                width: 100% !important;
                height: 500px !important;
            }

            @keyframes fadeInScale {
                0% { opacity: 0; transform: scale(0.8) translateY(30px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }

            /* Responsive cho tablet và điện thoại lớn (350px - 768px) - Layout 3-2-1 */
            @media (min-width: 350px) and (max-width: 768px) {
                .gallery-editorial {
                    gap: 8px !important;
                    padding: 12px 8px !important;
                }

                /* Dòng 1: 3 ảnh */
                .editorial-item:nth-child(6n+1),
                .editorial-item:nth-child(6n+2),
                .editorial-item:nth-child(6n+3) {
                    width: calc(33.333% - 6px) !important;
                    height: 140px !important;
                }
                /* Dòng 2: 2 ảnh */
                .editorial-item:nth-child(6n+4),
                .editorial-item:nth-child(6n+5) {
                    width: calc(50% - 4px) !important;
                    height: 200px !important;
                }
                /* Dòng 3: 1 ảnh to */
                .editorial-item:nth-child(6n+6) {
                    width: 100% !important;
                    height: 280px !important;
                }

                /* Giảm hiệu ứng hover trên mobile */
                .editorial-item:hover {
                    transform: translateY(-4px) scale(1.01) !important;
                }
            }

            /* Responsive cho điện thoại nhỏ (dưới 350px) - Layout 2 cột đều */
            @media (max-width: 349px) {
                .gallery-editorial {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 6px !important;
                    padding: 12px 6px !important;
                }

                /* TẤT CẢ ảnh đều hiển thị 2 cột với chiều cao bằng nhau */
                .editorial-item,
                .editorial-item:nth-child(6n+1),
                .editorial-item:nth-child(6n+2),
                .editorial-item:nth-child(6n+3),
                .editorial-item:nth-child(6n+4),
                .editorial-item:nth-child(6n+5),
                .editorial-item:nth-child(6n+6) {
                    width: 100% !important;
                    height: 150px !important;
                    grid-column: span 1 !important;
                    grid-row: span 1 !important;
                }

                /* Giảm hiệu ứng hover trên mobile */
                .editorial-item:hover {
                    transform: translateY(-4px) scale(1.01) !important;
                }
            }

            /* Responsive cho điện thoại rất nhỏ (dưới 360px) */
            @media (max-width: 359px) {
                .gallery-editorial {
                    gap: 4px !important;
                    padding: 10px 4px !important;
                }

                .editorial-item,
                .editorial-item:nth-child(6n+1),
                .editorial-item:nth-child(6n+2),
                .editorial-item:nth-child(6n+3),
                .editorial-item:nth-child(6n+4),
                .editorial-item:nth-child(6n+5),
                .editorial-item:nth-child(6n+6) {
                    height: 140px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

        // 3. Xóa class ẩn cũ
    const items = Array.from(galleryRoot.querySelectorAll('.editorial-item'));
        items.forEach((item) => {
            item.classList.remove('is-paged-hidden');
    });

        // 4. Kích hoạt tự động bấm vào nút Đám Hỏi khi web vừa load xong
        if (customFilterBtns.length > 0) {
            customFilterBtns[0].click();
        }
}


// Gallery Lightbox
let currentImageIndex = 0;
let lightboxImages = [];

function initLightboxIfNeeded() {
    // Hệ thống CSS Độc lập - Cách ly 100% khỏi Theme EJS cũ
    if (!document.getElementById('gal-lightbox-style')) {
        const style = document.createElement('style');
        style.id = 'gal-lightbox-style';
        style.textContent = `
            .gal-lightbox {
                display: none;
                position: fixed;
                z-index: 999999;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0,0,0,0.95);
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(5px);
            }
            .gal-lightbox.active {
                display: flex !important;
                opacity: 1;
            }
            .gal-lightbox-content {
                max-width: 95vw;
                max-height: 90vh;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 4px 25px rgba(0,0,0,0.5);
                transform: scale(0.95);
                transition: transform 0.3s ease;
                user-select: none;
                -webkit-user-drag: none;
            }
            .gal-lightbox.active .gal-lightbox-content {
                transform: scale(1);
            }
            .gal-close {
                position: absolute;
                top: 15px;
                right: 25px;
                color: #fff;
                font-size: 45px;
                font-weight: bold;
                cursor: pointer;
                z-index: 10;
                transition: 0.2s;
            }
            .gal-close:hover { color: #d4a373; transform: scale(1.1); }
            .gal-prev, .gal-next {
                cursor: pointer;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 24px;
                transition: 0.3s ease;
                user-select: none;
                z-index: 10;
                background: rgba(0,0,0,0.4);
                border-radius: 50%;
            }
            .gal-prev { left: 20px; }
            .gal-next { right: 20px; }
            .gal-prev:hover, .gal-next:hover { background-color: rgba(0,0,0,0.8); color: #d4a373; }
            .gal-hints { display: none; }
            
            @media (max-width: 768px) {
                .gal-prev, .gal-next { display: none !important; }
                .gal-close { top: 10px; right: 20px; font-size: 40px; }
                .gal-hints {
                    display: block;
                    position: absolute;
                    bottom: 25px;
                    color: rgba(255,255,255,0.6);
                    font-size: 14px;
                    pointer-events: none;
                    text-align: center;
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    let lightbox = document.getElementById('gal-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'gal-lightbox';
        lightbox.className = 'gal-lightbox';
        
        // Bypass hoàn toàn sự kiện bị chặn bằng lệnh onclick trực tiếp
        lightbox.innerHTML = `
            <div class="gal-close" onclick="closeLightbox()">&times;</div>
            <img class="gal-lightbox-content" id="gal-lightbox-image">
            <div class="gal-prev" onclick="event.stopPropagation(); changeLightboxImage(-1);">&#10094;</div>
            <div class="gal-next" onclick="event.stopPropagation(); changeLightboxImage(1);">&#10095;</div>
            <div class="gal-hints">Vuốt ngang để chuyển ảnh • Chạm nền đen để đóng</div>
        `;
        
        // Chỉ đóng khi bấm vào nền đen, không đóng khi bấm nhầm vào ảnh
        lightbox.addEventListener('click', (event) => {
            if (event.target.id === 'gal-lightbox') {
                closeLightbox();
            }
        });

        // Toán học tính toán thao tác Swipe siêu chuẩn
        let startX = 0;
        let startY = 0;

        lightbox.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        lightbox.addEventListener('touchend', e => {
            if (!startX || !startY) return;
            
            let diffX = e.changedTouches[0].clientX - startX;
            let diffY = e.changedTouches[0].clientY - startY;
            
            // Yêu cầu phải lướt tay mạnh sang ngang (chứ không phải lướt nhầm lên xuống)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
                if (diffX > 0) changeLightboxImage(-1); // Lướt tay sang phải -> lùi ảnh
                else changeLightboxImage(1); // Lướt tay sang trái -> tiến ảnh
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });

        document.body.appendChild(lightbox);
    }
    return lightbox;
}

function getVisibleGalleryImages() {
    return Array.from(document.querySelectorAll('.editorial-item:not(.is-filtered-out):not(.is-paged-hidden) img'))
        .filter(img => img.getAttribute('src'));
}

function setLightboxImage(index) {
    initLightboxIfNeeded();
    const lightboxImage = document.getElementById('gal-lightbox-image');
    if (!lightboxImage || lightboxImages.length === 0) {
        return;
    }

    if (index >= lightboxImages.length) currentImageIndex = 0;
    else if (index < 0) currentImageIndex = lightboxImages.length - 1;
    else currentImageIndex = index;

    lightboxImage.src = lightboxImages[currentImageIndex].src;
}

function openLightbox(index) {
    const lightbox = initLightboxIfNeeded();
    if (!lightbox) return;

    currentImageIndex = index;
    setLightboxImage(currentImageIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Khóa chống cuộn màn hình web lúc xem ảnh
}

function closeLightbox() {
    const lightbox = document.getElementById('gal-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Phục hồi cuộn trang web
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;
    setLightboxImage(currentImageIndex);
}

// Bắt sự kiện click hình ảnh một cách mạnh mẽ nhất (useCapture = true)
document.addEventListener('click', (event) => {
    const item = event.target.closest('.editorial-item');
    if (!item || item.classList.contains('is-filtered-out')) {
        return;
    }

    const targetImage = item.querySelector('img');
    if (!targetImage) {
        return;
    }

    event.preventDefault();
    event.stopPropagation(); // Ép chặn toàn bộ các chức năng mở ảnh cũ của theme

    lightboxImages = getVisibleGalleryImages();
    const index = lightboxImages.indexOf(targetImage);
    openLightbox(index >= 0 ? index : 0);
}, true);

document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('gal-lightbox');
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

        // --- BẮT BUỘC: Dọn dẹp toàn bộ các bộ lọc cũ (Lễ Cưới, Tiệc Cưới, Khoảnh Khắc) trên mọi giao diện ---
        document.querySelectorAll('[data-filter]').forEach(el => {
            const val = el.getAttribute('data-filter');
            if (val !== 'damhoi' && val !== 'damcuoi' && el.parentElement) {
                el.parentElement.classList.add('gallery-filters', 'filters');
                el.parentElement.innerHTML = `
                    <button class="filter-btn active" data-filter="damhoi">Đám Hỏi</button>
                    <button class="filter-btn" data-filter="damcuoi">Đám Cưới</button>
                `;
            }
        });

        // Initialize animations
        initEnvelopeAnimation();
        initVenueSelector();
        updateCountdown();
        initFloatingHeart();
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

        // Tự động thêm 2 nút Stick (Radio) Chọn Khách Cô Dâu / Chú Rể vào form Lời Chúc
        const gbForm = document.getElementById('guestbook-form');
        if (gbForm) {
            const submitBtn = gbForm.querySelector('.btn-submit');
            if (submitBtn && !gbForm.querySelector('input[name="guestType"]')) {
                const guestTypeDiv = document.createElement('div');
                guestTypeDiv.className = 'form-group guest-type-group';
                guestTypeDiv.style.marginBottom = '15px';
                guestTypeDiv.style.textAlign = 'left';
                guestTypeDiv.innerHTML = `
                <label style="display:block; margin-bottom:12px; font-weight:600; font-size: 16px;">Bạn là khách của:</label>
                <div style="display:flex; gap:25px; justify-content: flex-start; padding-left: 5px; flex-wrap: wrap;">
                    
                    <div style="display: flex; align-items: center; position: relative;">
                        <input type="radio" id="guestBride" name="guestType" value="Cô Dâu" required 
                            style="width: 22px; height: 22px; margin: 0 8px 0 0; cursor: pointer; accent-color: #d4a373;">
                        <label for="guestBride" style="cursor:pointer; font-size: 16px; margin: 0; line-height: 22px; 
                            -webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; 
                            -webkit-tap-highlight-color: transparent; touch-action: manipulation;">
                            Cô Dâu
                        </label>
                    </div>

                    <div style="display: flex; align-items: center; position: relative;">
                        <input type="radio" id="guestGroom" name="guestType" value="Chú Rể" required 
                            style="width: 22px; height: 22px; margin: 0 8px 0 0; cursor: pointer; accent-color: #d4a373;">
                        <label for="guestGroom" style="cursor:pointer; font-size: 16px; margin: 0; line-height: 22px; 
                            -webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; 
                            -webkit-tap-highlight-color: transparent; touch-action: manipulation;">
                            Chú Rể
                        </label>
                    </div>

                </div>
            `;
                            gbForm.insertBefore(guestTypeDiv, submitBtn.closest('.form-group') || submitBtn);
            }
        }

        console.log('✅ Wedding website initialized successfully!');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
});

// ===== MAP UPDATE FOR VENUE =====
function updateMapForVenue(venue) {
    const mapFrame = document.querySelector('.map-container iframe');
    const mapAddress = document.querySelector('.map-address');
    const mapLinks = document.querySelectorAll('a[href*="maps.google"], .map-link, .btn-map');

    let lat, lng, address, mapsUrl, placeName, mapQuery;
    if (venue === 'bride') {
        lat = 10.9382941;
        lng = 106.6881491;
        address = '37 Đ. Cách Mạng Tháng Tám, P. Lái Thiêu, Thuận An, Bình Dương';
        placeName = 'Trung Tâm Hội Nghị Tiệc Cưới Võ Gia Palace';
        mapQuery = 'Trung Tâm Hội Nghị Tiệc Cưới Võ Gia Palace, Thuận An, Bình Dương';
        mapsUrl = 'https://maps.google.com/maps?q=Trung+Tâm+Hội+Nghị+Tiệc+Cưới+Võ+Gia+Palace,+Thuận+An,+Bình+Dương';
    } else {
        lat = 10.97741;
        lng = 106.6632386;
        address = '1 Đ. Huỳnh Văn Lũy, Phú Lợi, Thủ Dầu Một, Bình Dương';
        placeName = 'Nhà Hàng Tiệc Cưới Thắng Lợi';
        mapQuery = 'Nhà Hàng Tiệc Cưới Thắng Lợi, Phú Lợi, Thủ Dầu Một, Hồ Chí Minh';
        mapsUrl = 'https://www.google.com/maps?q=Nhà+Hàng+Tiệc+Cưới+Thắng+Lợi,+Phú+Lợi,+Thủ+Dầu+Một,+Hồ+Chí+Minh';
    }

    if (weddingConfig) {
        if (venue === 'bride' && weddingConfig.brideReception) {
            lat = weddingConfig.brideReception.coordinates?.lat || lat;
            lng = weddingConfig.brideReception.coordinates?.lng || lng;
            address = weddingConfig.brideReception.address || address;
            mapsUrl = weddingConfig.brideReception.mapsUrl || mapsUrl;
            placeName = weddingConfig.brideReception.location || placeName;
        } else if (venue === 'groom' && weddingConfig.groomReception) {
            lat = weddingConfig.groomReception.coordinates?.lat || lat;
            lng = weddingConfig.groomReception.coordinates?.lng || lng;
            address = weddingConfig.groomReception.address || address;
            mapsUrl = weddingConfig.groomReception.mapsUrl || mapsUrl;
            placeName = weddingConfig.groomReception.location || placeName;
        }
    }

    if (mapFrame) {
        // Sử dụng tên đăng ký gốc của Google Maps (mapQuery) để giúp khung iframe hiển thị chuẩn 100%
        let queryText = (placeName === 'Trung Tâm Hội Nghị Tiệc Cưới Võ Gia Palace' || placeName === 'Nhà Hàng Tiệc Cưới Thắng Lợi') ? mapQuery : `${placeName}, ${address}`;
        const query = encodeURIComponent(queryText);
        mapFrame.src = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
    }
    if (mapAddress) {
        mapAddress.textContent = address;
    }
    
    // Cập nhật đường link cho các nút "Chỉ đường / Open Map"
    if (mapLinks.length > 0) {
        mapLinks.forEach(link => {
            link.href = mapsUrl;
            link.target = '_blank'; // Đảm bảo luôn mở sang tab mới hoặc app Maps
        });
    }
}

// ===== DATE UPDATE FOR VENUE =====
function updateDateForVenue(venue) {
    // Ngày mặc định ban đầu nếu server chưa phản hồi
    let dateStr = venue === 'groom' ? '2026-07-19' : '2026-07-12';
    let timeStr = venue === 'groom' ? '11:00' : '18:00';
    let locationStr = venue === 'groom' ? 'Nhà hàng khách sạn Thắng Lợi' : 'Trung Tâm Hội Nghị Tiệc Cưới Võ Gia Palace';

    // Đọc ngày từ cấu hình JSON của bạn để dễ tinh chỉnh
    if (weddingConfig) {
        if (venue === 'groom' && weddingConfig.groomReception) {
            dateStr = weddingConfig.groomReception.date || dateStr;
            timeStr = weddingConfig.groomReception.time || timeStr;
            locationStr = weddingConfig.groomReception.location || locationStr;
        } else if (venue === 'bride' && weddingConfig.brideReception) {
            dateStr = weddingConfig.brideReception.date || dateStr;
            timeStr = weddingConfig.brideReception.time || timeStr;
            locationStr = weddingConfig.brideReception.location || locationStr;
        }
    }

    // Chuyển định dạng YYYY-MM-DD sang DD/MM/YYYY cho hiển thị Text
    const parts = dateStr.split('-');
    const dateDisplayStr = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;

    // 1. Cập nhật ngày cho countdown để bộ đếm lùi tự điều chỉnh
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.setAttribute('data-date', dateStr);
        countdownEl.setAttribute('data-time', timeStr);
    }

    // 2. Cập nhật các đoạn text hiển thị ngày trên giao diện
    const dateElements = document.querySelectorAll('.ceremony-date, .reception-date, .wedding-date, .date-display, #ceremony-date, #reception-date, #wedding-date');
    dateElements.forEach(el => {
        el.textContent = dateDisplayStr;
    });

    // 3. Cập nhật chi tiết thời gian và địa điểm Tiệc Cưới
    const receptionTimeEl = document.querySelector('.detail-card.reception .time');
    const receptionLocationEl = document.querySelector('.detail-card.reception .location');
    if (receptionTimeEl) receptionTimeEl.textContent = timeStr;
    if (receptionLocationEl) receptionLocationEl.textContent = locationStr;

    // 4. Vẽ lại toàn bộ tờ lịch (Calendar) và cập nhật ngày đánh dấu
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Tháng trong JS tính từ 0
        const day = parseInt(parts[2], 10);

        // Cập nhật tiêu đề tháng/năm
        const calYearEl = document.querySelector('.calendar-year');
        const calMonthEl = document.querySelector('.calendar-month');
        if (calYearEl) calYearEl.textContent = year;
        if (calMonthEl) calMonthEl.textContent = `Tháng ${month + 1}`;

        // Cập nhật lại toàn bộ các ô ngày trong lưới
        const calendarDaysContainer = document.querySelector('.calendar-days');
        if (calendarDaysContainer) {
            const firstDow = new Date(year, month, 1).getDay();
            const leadingEmpty = (firstDow + 6) % 7; // Dịch chủ nhật (0) về cuối tuần
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            let daysHtml = '';
            for (let i = 0; i < leadingEmpty; i++) {
                daysHtml += '<div class="calendar-cell is-empty"></div>';
            }
            
            for (let d = 1; d <= daysInMonth; d++) {
                const isSelected = d === day ? 'is-selected' : ''; // Dùng is-selected theo đúng class CSS của EJS
                daysHtml += `<div class="calendar-cell ${isSelected}"><span>${d}</span></div>`;
            }
            
            calendarDaysContainer.innerHTML = daysHtml;
        }
    }
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
