// Mobile optimization for partners section
document.addEventListener('DOMContentLoaded', function() {
    initMobilePartners();
    initPartnersInteractions();
});

function initMobilePartners() {
    // Адаптация секции партнеров для мобильных
    adaptPartnersLayout();
    
    // Обработчики изменения размера и ориентации
    window.addEventListener('resize', debounce(adaptPartnersLayout, 250));
    window.addEventListener('orientationchange', function() {
        setTimeout(adaptPartnersLayout, 100);
    });
    
    // Инициализация карусели для очень маленьких экранов
    initPartnersCarousel();
    
    // Оптимизация загрузки изображений
    optimizePartnersImages();
}

function adaptPartnersLayout() {
    const partnersSection = document.querySelector('.partners-section');
    const partnersGrid = document.querySelector('.partners-grid');
    const partnerCards = document.querySelectorAll('.partner-card');
    
    if (!partnersSection || !partnersGrid) return;
    
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth <= 968;
    const isVerySmall = window.innerWidth <= 320;
    
    // Адаптация для ландшафтного режима
    if (isMobile && isLandscape) {
        partnersGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        partnersGrid.style.gap = '15px';
        partnersGrid.style.maxWidth = '600px';
        
        partnerCards.forEach(card => {
            card.style.height = '150px';
            card.style.minHeight = '130px';
            card.style.padding = '10px 10px 20px';
        });
    } else if (isMobile) {
        partnersGrid.style.gridTemplateColumns = '1fr';
        partnersGrid.style.gap = '20px';
        partnersGrid.style.maxWidth = '400px';
    } else {
        partnersGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        partnersGrid.style.gap = '40px';
        partnersGrid.style.maxWidth = '';
    }
    
    // Активация карусели для очень маленьких экранов
    if (isVerySmall) {
        activatePartnersCarousel();
    } else {
        deactivatePartnersCarousel();
    }
}

function initPartnersInteractions() {
    const partnerCards = document.querySelectorAll('.partner-card');
    
    // Добавляем touch-оптимизацию для карточек партнеров
    partnerCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
        
        card.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
        
        // Добавляем возможность тапа для открытия дополнительной информации
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                showPartnerDetails(this);
            }
        });
    });
}

function showPartnerDetails(card) {
    const partnerName = card.querySelector('.partner-name').textContent;
    const partnerLogo = card.querySelector('.partner-logo').src;
    
    // Создаем модальное окно с детальной информацией
    const modal = document.createElement('div');
    modal.className = 'partner-modal';
    modal.innerHTML = `
        <div class="partner-modal-content">
            <button class="partner-modal-close">&times;</button>
            <div class="partner-modal-logo">
                <img src="${partnerLogo}" alt="${partnerName}" loading="lazy">
            </div>
            <h3 class="partner-modal-title">${partnerName}</h3>
            <div class="partner-modal-info">
                <p>Информация о партнере будет добавлена здесь.</p>
            </div>
        </div>
        <div class="partner-modal-overlay"></div>
    `;
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Обработчик закрытия
    const closeBtn = modal.querySelector('.partner-modal-close');
    const overlay = modal.querySelector('.partner-modal-overlay');
    
    closeBtn.addEventListener('click', closePartnerModal);
    overlay.addEventListener('click', closePartnerModal);
    
    function closePartnerModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    // Закрытие по ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closePartnerModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function initPartnersCarousel() {
    // Создаем структуру карусели для очень маленьких экранов
    const partnersGrid = document.querySelector('.partners-grid');
    if (!partnersGrid || window.innerWidth > 320) return;
    
    const partnerCards = Array.from(partnersGrid.querySelectorAll('.partner-card'));
    if (partnerCards.length <= 1) return;
    
    const carouselHTML = `
        <div class="partners-carousel">
            <div class="carousel-track">
                ${partnerCards.map(card => `
                    <div class="carousel-slide">
                        ${card.outerHTML}
                    </div>
                `).join('')}
            </div>
            <div class="carousel-nav">
                ${partnerCards.map((_, index) => `
                    <button class="carousel-dot ${index === 0 ? 'active' : ''}" 
                            data-index="${index}"></button>
                `).join('')}
            </div>
        </div>
    `;
    
    partnersGrid.insertAdjacentHTML('afterend', carouselHTML);
}

function activatePartnersCarousel() {
    const partnersGrid = document.querySelector('.partners-grid');
    const partnersCarousel = document.querySelector('.partners-carousel');
    
    if (!partnersGrid || !partnersCarousel) return;
    
    partnersGrid.style.display = 'none';
    partnersCarousel.style.display = 'block';
    
    initCarouselInteractions();
}

function deactivatePartnersCarousel() {
    const partnersGrid = document.querySelector('.partners-grid');
    const partnersCarousel = document.querySelector('.partners-carousel');
    
    if (partnersGrid) partnersGrid.style.display = 'grid';
    if (partnersCarousel) partnersCarousel.style.display = 'none';
}

function initCarouselInteractions() {
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    
    if (!carouselTrack || !carouselDots.length) return;
    
    let currentSlide = 0;
    const slideWidth = carouselSlides[0].offsetWidth;
    const gap = 10;
    
    // Инициализация позиции
    updateCarouselPosition();
    
    // Обработчики для точек навигации
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarouselPosition();
            updateCarouselDots();
        });
    });
    
    // Touch-свайпы для карусели
    let startX = 0;
    let currentX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', () => {
        const diff = startX - currentX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < carouselSlides.length - 1) {
                // Свайп влево
                currentSlide++;
            } else if (diff < 0 && currentSlide > 0) {
                // Свайп вправо
                currentSlide--;
            }
            
            updateCarouselPosition();
            updateCarouselDots();
        }
    }, { passive: true });
    
    function updateCarouselPosition() {
        const translateX = -currentSlide * (slideWidth + gap);
        carouselTrack.style.transform = `translateX(${translateX}px)`;
    }
    
    function updateCarouselDots() {
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

function optimizePartnersImages() {
    const partnerLogos = document.querySelectorAll('.partner-logo');
    
    partnerLogos.forEach(logo => {
        // Добавляем lazy loading
        if (!logo.loading) {
            logo.loading = 'lazy';
        }
        
        // Обработка ошибок загрузки
        logo.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'logo-placeholder';
            placeholder.textContent = this.alt || 'Логотип';
            this.parentNode.appendChild(placeholder);
        });
        
        // Показываем placeholder пока изображение загружается
        if (!logo.complete) {
            logo.style.opacity = '0';
            logo.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.3s ease';
            });
        }
    });
}

// Вспомогательная функция для ограничения частоты вызовов
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// CSS для модального окна партнера (добавляется динамически)
function addPartnersModalStyles() {
    const styles = `
        .partner-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .partner-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .partner-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .partner-modal-content {
            position: relative;
            background: #1a1a1a;
            border-radius: 15px;
            padding: 30px;
            max-width: 400px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 10001;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .partner-modal.active .partner-modal-content {
            transform: scale(1);
        }
        
        .partner-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        }
        
        .partner-modal-logo {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .partner-modal-logo img {
            max-width: 150px;
            max-height: 100px;
            object-fit: contain;
        }
        
        .partner-modal-title {
            color: #fff;
            text-align: center;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .partner-modal-info {
            color: #e0e0e0;
            line-height: 1.5;
        }
        
        @media (max-width: 480px) {
            .partner-modal {
                padding: 10px;
            }
            
            .partner-modal-content {
                padding: 20px;
                max-width: 100%;
            }
            
            .partner-modal-logo img {
                max-width: 120px;
                max-height: 80px;
            }
            
            .partner-modal-title {
                font-size: 1.3rem;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    addPartnersModalStyles();
});