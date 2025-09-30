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
    const mapContainer = document.querySelector('#geo-map');
    
    if (!objectItems.length || !mapContainer) return;
    
    // Добавляем интерактивность элементам списка
    objectItems.forEach((item, index) => {
        // Клик по элементу списка
        item.addEventListener('click', function() {
            // Убираем активный класс у всех элементов
            objectItems.forEach(obj => obj.classList.remove('active'));
            // Добавляем активный класс текущему элементу
            this.classList.add('active');
            
            // Центрируем карту на соответствующем объекте
            centerMapOnObject(index);
            
            // Показываем балун на карте
            showMapBalloon(index);
        });
        
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

function centerMapOnObject(objectIndex) {
    // Координаты объектов (должны совпадать с geography_map.js)
    const objectsCoordinates = [
        [59.729722, 29.834722], // Лаголово
        [59.750839, 30.588553], // Колпино
        [60.051389, 30.485556]  // Новое Девяткино
    ];
    
    if (objectsCoordinates[objectIndex] && window.geoMap) {
        window.geoMap.setCenter(objectsCoordinates[objectIndex], 14, {
            duration: 500
        });
    }
}

function showMapBalloon(objectIndex) {
    // Эта функция будет работать с существующими метками на карте
    if (window.geoMap && window.geoMap.geoObjects) {
        const geoObjects = window.geoMap.geoObjects;
        if (geoObjects.getLength() > objectIndex) {
            const placemark = geoObjects.get(objectIndex);
            if (placemark) {
                placemark.balloon.open();
            }
        }
    }
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
    
    // Восстанавливаем оригинальный HTML с картой
    mapContainer.innerHTML = '<div id="geo-map"></div>';
}

// Интеграция с существующей картой из geography_map.js
function initMapIntegration() {
    // Перехватываем инициализацию карты для добавления мобильной оптимизации
    const originalInitGeoMap = window.initGeoMap;
    
    window.initGeoMap = function() {
        showMapLoading();
        
        // Ждем немного перед инициализацией для лучшего UX
        setTimeout(function() {
            if (typeof originalInitGeoMap === 'function') {
                originalInitGeoMap();
            }
            
            // Даем карте время на рендеринг
            setTimeout(hideMapLoading, 1000);
            
            // Сохраняем ссылку на карту в глобальной области
            if (typeof ymaps !== 'undefined') {
                ymaps.ready(function() {
                    window.geoMap = new ymaps.Map('geo-map', {
                        center: [59.939095, 30.315868],
                        zoom: 9,
                        controls: ['zoomControl', 'fullscreenControl']
                    }, {
                        searchControlProvider: 'yandex#search'
                    });
                    
                    // Добавляем мобильные классы
                    if (window.innerWidth <= 768) {
                        window.geoMap.container.getElement().classList.add('ymaps-2-1-79-map-mobile');
                    }
                });
            }
        }, 500);
    };
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
    
    // Показываем состояние загрузки пока карта не готова
    showMapLoading();
    
    // Скрываем loading через 5 секунд на случай ошибки
    setTimeout(hideMapLoading, 5000);
});