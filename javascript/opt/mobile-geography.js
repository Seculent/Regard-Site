// Mobile optimization for geography section
document.addEventListener('DOMContentLoaded', function() {
    initMobileGeography();
    initMapInteractions();
});

function initMobileGeography() {
    // Адаптация секции географии для мобильных
    adaptGeographyLayout();
    
    // Обработчики изменения размера и ориентации
    window.addEventListener('resize', debounce(adaptGeographyLayout, 250));
    window.addEventListener('orientationchange', function() {
        setTimeout(adaptGeographyLayout, 100);
    });
    
    // Инициализация интерактивных элементов
    initInteractiveElements();
}

function adaptGeographyLayout() {
    const geographySection = document.querySelector('.geography-section');
    const mapContainer = document.querySelector('.map-container-geo');
    const objectsList = document.querySelector('.objects-list');
    
    if (!geographySection || !mapContainer || !objectsList) return;
    
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth <= 968;
    
    // Адаптация для ландшафтного режима
    if (isMobile && isLandscape) {
        geographySection.style.padding = '30px 0';
        mapContainer.style.height = '280px';
        objectsList.style.maxHeight = '280px';
        objectsList.style.overflowY = 'auto';
    } else {
        objectsList.style.maxHeight = '';
        objectsList.style.overflowY = '';
    }
    
    // Оптимизация для очень маленьких экранов
    if (window.innerWidth <= 360) {
        const objectItems = document.querySelectorAll('.object-item');
        objectItems.forEach(item => {
            item.style.flexDirection = 'column';
            item.style.textAlign = 'center';
            item.style.gap = '8px';
        });
    } else {
        const objectItems = document.querySelectorAll('.object-item');
        objectItems.forEach(item => {
            item.style.flexDirection = 'row';
            item.style.textAlign = 'left';
            item.style.gap = '';
        });
    }
}

function initInteractiveElements() {
    const objectItems = document.querySelectorAll('.object-item');
    
    if (!objectItems.length) return;
    
    // Добавляем интерактивность элементам списка
    objectItems.forEach((item, index) => {
        // Touch-оптимизация
        item.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        item.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Инициализация свайпов для карты на мобильных
    initMapTouchControls();
}

function initMapTouchControls() {
    const mapContainer = document.querySelector('#geo-map');
    if (!mapContainer) return;
    
    let touchStart = null;
    let isScrolling = null;
    
    mapContainer.addEventListener('touchstart', function(e) {
        touchStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        isScrolling = null;
    }, { passive: true });
    
    mapContainer.addEventListener('touchmove', function(e) {
        if (!touchStart) return;
        
        const touchCurrent = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        
        const diffX = Math.abs(touchCurrent.x - touchStart.x);
        const diffY = Math.abs(touchCurrent.y - touchStart.y);
        
        // Определяем, это скролл или свайп
        if (isScrolling === null) {
            isScrolling = diffY > diffX;
        }
    }, { passive: true });
    
    mapContainer.addEventListener('touchend', function(e) {
        if (!touchStart || isScrolling) {
            touchStart = null;
            return;
        }
        
        touchStart = null;
    }, { passive: true });
}

// Функция для отображения состояния загрузки карты
function showMapLoading() {
    const mapContainer = document.querySelector('.map-container-geo');
    if (!mapContainer) return;
    
    mapContainer.classList.add('loading');
    mapContainer.innerHTML = `
        <div class="map-loading">
            <div class="map-loading-spinner"></div>
            <p>Загрузка карты...</p>
        </div>
    `;
}

function hideMapLoading() {
    const mapContainer = document.querySelector('.map-container-geo');
    if (!mapContainer) return;
    
    mapContainer.classList.remove('loading');
    mapContainer.classList.add('loaded');
}

// Интеграция с существующей картой из geography_map.js
function initMapIntegration() {
    // Показываем состояние загрузки пока карта не готова
    const geoMapContainer = document.querySelector('#geo-map');
    if (geoMapContainer && !geoMapContainer.querySelector('.ymaps-2-1-79-map')) {
        showMapLoading();
    }
    
    // Скрываем loading через 5 секунд на случай ошибки
    setTimeout(hideMapLoading, 5000);
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initMapIntegration();
});