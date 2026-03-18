// counter.js
document.addEventListener('DOMContentLoaded', function() {
    // Собираем все data-атрибуты из карусели
    const carouselItems = document.querySelectorAll('#projectsCarousel .carousel-item');
    let totalArea = 0;
    carouselItems.forEach(item => {
        const area = parseFloat(item.dataset.area);
        if (!isNaN(area)) {
            totalArea += area;
        }
    });

    // Если по какой-то причине data-атрибуты отсутствуют, используем запасной массив
    if (totalArea === 0) {
        const fallbackAreas = [5000, 3200, 4500, 2800, 3800, 4200, 5100];
        totalArea = fallbackAreas.reduce((a, b) => a + b, 0);
        console.warn('data-area не найдены, использованы значения по умолчанию');
    }

    const counterSpan = document.getElementById('totalAreaCounter');
    const progressBar = document.querySelector('.progress-bar'); // добавили
    if (!counterSpan) return;

    let animated = false;

    function animateCounter(target) {
        let startTimestamp = null;
        const duration = 2000;
        const startValue = 0;

        // Сразу запускаем анимацию прогресс-бара
        if (progressBar) {
            progressBar.style.width = '100%'; // <-- ВОТ ЭТА СТРОКА
        }

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * target);
            counterSpan.textContent = currentValue.toLocaleString('ru-RU');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counterSpan.textContent = target.toLocaleString('ru-RU');
            }
        };

        window.requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounter(totalArea);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(counterSpan.parentElement.parentElement);
});