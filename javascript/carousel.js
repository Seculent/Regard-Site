// Карусель для секции "Наши объекты"
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    let currentIndex = 0;
    const totalItems = items.length;
    let autoSlideInterval;
    
    // Функция для обновления карусели
    function updateCarousel() {
        // Убедимся, что индекс в пределах допустимого
        if (currentIndex < 0) currentIndex = totalItems - 1;
        if (currentIndex >= totalItems) currentIndex = 0;
        
        // Применяем трансформацию
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Обновление активного индикатора
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Следующий слайд
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
        resetAutoSlide();
    }
    
    // Предыдущий слайд
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
        resetAutoSlide();
    }
    
    // Переход по индикаторам
    function goToSlide(index) {
        if (index >= 0 && index < totalItems) {
            currentIndex = index;
            updateCarousel();
            resetAutoSlide();
        }
    }
    
    // Автоматическое переключение слайдов
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    // Сброс автоматического переключения
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Обработчики событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    // Инициализация при загрузке
    updateCarousel();
    
    // Запуск автоматического переключения
    startAutoSlide();
    
    // Остановка при наведении
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Обработка касаний для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval); // Остановить автослайд при касании
    });
    
    carouselContainer.addEventListener('touchend', e => {
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
        
        // Перезапустить автослайд через 3 секунды после касания
        setTimeout(() => {
            startAutoSlide();
        }, 3000);
    }
});