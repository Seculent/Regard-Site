// Слайд-шоу для секции "Наши объекты" без автоперехода
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const indicators = document.querySelectorAll('.indicator');
    
    // Проверяем, что элементы существуют
    if (!slides || slideItems.length === 0) {
        console.error('Элементы слайд-шоу не найдены');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slideItems.length;
    
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
    
    // Обработчики событий
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showSlide(index);
        });
    });
    
    // Обработка свайпов для мобильных устройств
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        slideshowContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
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
        }
    }
    
    // Инициализация - показываем первый слайд
    showSlide(0);
});