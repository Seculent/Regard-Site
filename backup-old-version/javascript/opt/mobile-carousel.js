// Mobile optimization for carousel section
document.addEventListener('DOMContentLoaded', function() {
    initMobileCarousel();
    initTouchCarousel();
});

function initMobileCarousel() {
    const carousel = document.querySelector('.slideshow-container');
    if (!carousel) return;

    // Адаптация карусели для мобильных
    adaptCarouselForMobile();
    
    // Обработчик изменения ориентации
    window.addEventListener('orientationchange', function() {
        setTimeout(adaptCarouselForMobile, 100);
    });
    
    // Обработчик изменения размера
    window.addEventListener('resize', debounce(adaptCarouselForMobile, 250));
}

function adaptCarouselForMobile() {
    const isMobile = window.innerWidth <= 768;
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    // Увеличиваем индикаторы на мобильных
    if (isMobile) {
        indicators.forEach(indicator => {
            indicator.style.minWidth = '16px';
            indicator.style.minHeight = '16px';
        });
        
        // Оптимизируем кнопки навигации
        if (prevBtn && nextBtn) {
            prevBtn.style.fontSize = '16px';
            nextBtn.style.fontSize = '16px';
        }
    } else {
        // Возвращаем исходные размеры на десктопе
        indicators.forEach(indicator => {
            indicator.style.minWidth = '14px';
            indicator.style.minHeight = '14px';
        });
    }
}

function initTouchCarousel() {
    const slidesContainer = document.querySelector('.slides');
    if (!slidesContainer) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // Touch events для свайпа
    slidesContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    slidesContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    slidesContainer.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const swipeThreshold = 50; // Минимальное расстояние для свайпа
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                triggerNextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                triggerPrevSlide();
            }
        }
        
        isDragging = false;
    }

    function triggerNextSlide() {
        const nextBtn = document.querySelector('.next');
        if (nextBtn) {
            nextBtn.click();
        }
    }

    function triggerPrevSlide() {
        const prevBtn = document.querySelector('.prev');
        if (prevBtn) {
            prevBtn.click();
        }
    }

    // Оптимизация модального окна для touch
    const modal = document.getElementById('projectModal');
    if (modal) {
        let modalStartY = 0;
        
        modal.addEventListener('touchstart', function(e) {
            modalStartY = e.touches[0].clientY;
        }, { passive: true });

        modal.addEventListener('touchend', function(e) {
            const endY = e.changedTouches[0].clientY;
            const diff = endY - modalStartY;
            
            // Закрытие модального окна свайпом вниз
            if (diff > 100) {
                closeProjectModal();
            }
        }, { passive: true });
    }

    // Улучшение галереи в модальном окне для touch
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        let galleryStartX = 0;
        
        img.addEventListener('touchstart', function(e) {
            galleryStartX = e.touches[0].clientX;
        }, { passive: true });

        img.addEventListener('touchend', function(e) {
            const endX = e.changedTouches[0].clientX;
            const diff = endX - galleryStartX;
            const swipeThreshold = 30;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Свайп вправо - предыдущее изображение
                    triggerPrevGalleryImage();
                } else {
                    // Свайп влево - следующее изображение
                    triggerNextGalleryImage();
                }
            }
        }, { passive: true });
    });
}

function triggerNextGalleryImage() {
    const nextBtn = document.querySelector('.gallery-next');
    if (nextBtn) {
        nextBtn.click();
    }
}

function triggerPrevGalleryImage() {
    const prevBtn = document.querySelector('.gallery-prev');
    if (prevBtn) {
        prevBtn.click();
    }
}

function closeProjectModal() {
    const closeBtn = document.querySelector('.close-modal-project');
    if (closeBtn) {
        closeBtn.click();
    }
}

// Автопрокрутка для мобильных (опционально)
function initAutoCarousel() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    let autoScrollInterval;
    const slideshow = document.querySelector('.slideshow-container');

    if (!slideshow) return;

    // Запускаем автопрокрутку только если пользователь не взаимодействует
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            triggerNextSlide();
        }, 5000); // 5 секунд
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Запускаем автопрокрутку
    startAutoScroll();

    // Останавливаем при взаимодействии пользователя
    slideshow.addEventListener('mouseenter', stopAutoScroll);
    slideshow.addEventListener('touchstart', stopAutoScroll);
    
    // Возобновляем когда пользователь уходит
    slideshow.addEventListener('mouseleave', startAutoScroll);
    slideshow.addEventListener('touchend', () => {
        setTimeout(startAutoScroll, 3000);
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

// Инициализация автопрокрутки (раскомментируйте если нужно)
// document.addEventListener('DOMContentLoaded', initAutoCarousel);