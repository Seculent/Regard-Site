// Простое слайд-шоу для секции "Наши объекты"
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = slideItems.length;
    let slideInterval;
    
    // Функция для показа слайда
    function showSlide(index) {
        // Проверяем границы
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        // Сдвигаем слайды
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Обновляем индикаторы
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Следующий слайд
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Автоматическое переключение
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Остановка автоматического переключения
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Обработчики событий
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideshow();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideshow();
    });
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showSlide(index);
            resetSlideshow();
        });
    });
    
    // Сброс таймера при взаимодействии
    function resetSlideshow() {
        stopSlideshow();
        startSlideshow();
    }
    
    // Остановка при наведении
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.addEventListener('mouseenter', stopSlideshow);
    slideshowContainer.addEventListener('mouseleave', startSlideshow);
    
    // Запуск слайд-шоу
    startSlideshow();
    
    // Обработка свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    slideshowContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlideshow();
    });
    
    slideshowContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Свайп влево
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Свайп вправо
        }
        
        // Перезапуск через 3 секунды после свайпа
        setTimeout(startSlideshow, 3000);
    }
    
    // Инициализация - показываем первый слайд
    showSlide(0);
});