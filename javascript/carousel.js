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
    
    // Инициализация карусели
    function initCarousel() {
        // Устанавливаем начальную позицию
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Активируем первый индикатор
        indicators[currentIndex].classList.add('active');
    }
    
    // Функция для обновления карусели
    function updateCarousel() {
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
        currentIndex = index;
        updateCarousel();
        resetAutoSlide();
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
    initCarousel();
    
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
});