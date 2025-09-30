// Mobile optimization for hero section
document.addEventListener('DOMContentLoaded', function() {
    initMobileHero();
    initTouchOptimizations();
});

function initMobileHero() {
    // Оптимизация для мобильных устройств
    optimizeHeroLayout();
    
    // Обработчик изменения ориентации
    window.addEventListener('orientationchange', function() {
        setTimeout(optimizeHeroLayout, 100);
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', debounce(optimizeHeroLayout, 250));
}

function optimizeHeroLayout() {
    const heroSection = document.querySelector('.hero');
    const heroInfo = document.querySelector('.hero--info');
    const sertifContainer = document.querySelector('.sertif');
    
    if (!heroSection || !heroInfo || !sertifContainer) return;
    
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth <= 968;
    
    // Оптимизация для ландшафтного режима на мобильных
    if (isMobile && isLandscape) {
        heroSection.style.flexDirection = 'row';
        heroSection.style.textAlign = 'left';
        heroInfo.style.width = '60%';
        sertifContainer.style.width = '40%';
        sertifContainer.style.justifyContent = 'flex-end';
    }
    
    // Оптимизация количества отображаемых сертификатов на очень маленьких экранах
    if (window.innerWidth <= 360) {
        const certButtons = document.querySelectorAll('.btn_sert');
        if (certButtons.length > 3) {
            certButtons.forEach((btn, index) => {
                if (index >= 3) {
                    btn.style.display = 'none';
                }
            });
        }
    } else {
        // Показываем все сертификаты на больших экранах
        const certButtons = document.querySelectorAll('.btn_sert');
        certButtons.forEach(btn => {
            btn.style.display = 'flex';
        });
    }
}

function initTouchOptimizations() {
    // Улучшение обработки касаний для кнопок сертификатов
    const certButtons = document.querySelectorAll('.btn_sert');
    
    certButtons.forEach(button => {
        // Предотвращаем выделение текста при долгом нажатии
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
        }, { passive: false });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Оптимизация модального окна для touch-устройств
    const modal = document.getElementById('imageModal');
    if (modal) {
        let startY = 0;
        let currentY = 0;
        
        modal.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        modal.addEventListener('touchmove', function(e) {
            currentY = e.touches[0].clientY;
        }, { passive: true });
        
        modal.addEventListener('touchend', function(e) {
            const diff = currentY - startY;
            
            // Закрытие модального окна свайпом вниз
            if (diff > 100) {
                closeModal();
            }
        }, { passive: true });
    }
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

// Функция для lazy loading изображений сертификатов
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const certImages = document.querySelectorAll('.sert');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        certImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
}

// Инициализация lazy loading при загрузке DOM
document.addEventListener('DOMContentLoaded', initLazyLoading);