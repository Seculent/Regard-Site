// Инициализация карты географии объектов
ymaps.ready(initGeoMap);

function initGeoMap() {
    try {
        console.log('Инициализация карты географии...');
        
        const geoMap = new ymaps.Map('geo-map', {
            center: [59.939095, 30.315868], // Центр на Санкт-Петербург
            zoom: 9,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем метки для объектов
        const objects = [
            {
                coords: [59.729722, 29.834722], // Лаголово
                title: 'Лаголово А101',
                content: 'деревня Лаголово, Лаголовское сельское поселение, Ломоносовский район, Ленинградская область',
                markerColor: '#ed4545'
            },
            {
                coords: [59.750839, 30.588553], // Колпино
                title: 'Живи в Песочном!',
                content: 'Колпино, Санкт-Петербург',
                markerColor: '#2b90e8'
            },
            {
                coords: [60.051389, 30.485556], // Новое Девяткино
                title: 'UP-Квартал Воронцовский',
                content: 'деревня Новое Девяткино, Всеволожский район, Ленинградская область',
                markerColor: '#11f305'
            }
        ];

        // Добавляем метки на карту
        objects.forEach((obj, index) => {
            const placemark = new ymaps.Placemark(obj.coords, {
                balloonContentHeader: obj.title,
                balloonContentBody: obj.content,
                hintContent: obj.title
            }, {
                preset: 'islands#circleIcon',
                iconColor: obj.markerColor
            });
            
            geoMap.geoObjects.add(placemark);
            
            // Связываем метки с элементами списка
            placemark.events.add('click', function() {
                const objectItems = document.querySelectorAll('.object-item');
                objectItems.forEach(item => item.classList.remove('active'));
                if (objectItems[index]) {
                    objectItems[index].classList.add('active');
                }
            });
        });

        // Сохраняем ссылку на карту
        window.geoMap = geoMap;
        
        // Убираем состояние загрузки
        const mapContainer = document.querySelector('.map-container-geo');
        if (mapContainer) {
            mapContainer.classList.remove('loading');
            mapContainer.classList.add('loaded');
        }
        
        // Адаптация для мобильных устройств
        if (window.innerWidth < 768) {
            optimizeMapForMobile();
        }
        
        console.log('Карта географии успешно инициализирована');
        
    } catch (error) {
        console.error('Ошибка инициализации карты географии:', error);
        showGeoMapError();
    }
}

// Функция для отображения ошибки карты географии
function showGeoMapError() {
    const mapContainer = document.getElementById('geo-map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; background: rgba(255,255,255,0.1); border-radius: 8px; height: 100%; display: flex; flex-direction: column; justify-content: center; color: #fff;">
                <h3 style="color: #ee9393; margin-bottom: 10px;">Ошибка загрузки карты</h3>
                <p style="margin-bottom: 15px; color: #ccc;">Не удалось загрузить карту объектов</p>
                <a href="https://yandex.ru/maps/2/saint-petersburg/" 
                   target="_blank" 
                   style="color: #ee9393; text-decoration: none; font-weight: 500;">
                    Посмотреть на Яндекс.Картах →
                </a>
            </div>
        `;
    }
}

// Оптимизация карты для мобильных устройств
function optimizeMapForMobile() {
    if (window.innerWidth <= 768 && window.geoMap) {
        // Упрощаем контролы для мобильных
        window.geoMap.controls.remove('typeSelector');
        window.geoMap.controls.remove('searchControl');
        
        // Настраиваем поведение для touch-устройств
        window.geoMap.behaviors.disable('drag');
        window.geoMap.behaviors.disable('scrollZoom');
        
        // Добавляем мобильный класс
        window.geoMap.container.getElement().classList.add('ymaps-2-1-79-map-mobile');
    }
}

// Обработчик изменения размера для адаптации
window.addEventListener('resize', function() {
    if (window.geoMap) {
        optimizeMapForMobile();
    }
});

// Инициализация взаимодействия с элементами списка
document.addEventListener('DOMContentLoaded', function() {
    const objectItems = document.querySelectorAll('.object-item');
    
    objectItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Убираем активный класс у всех элементов
            objectItems.forEach(obj => obj.classList.remove('active'));
            // Добавляем активный класс текущему элементу
            this.classList.add('active');
            
            // Центрируем карту на соответствующем объекте
            centerMapOnObject(index);
        });
    });
});

// Функция для центрирования карты на объекте
function centerMapOnObject(objectIndex) {
    const objectsCoordinates = [
        [59.729722, 29.834722], // Лаголово
        [59.750839, 30.588553], // Колпино
        [60.051389, 30.485556]  // Новое Девяткино
    ];
    
    if (objectsCoordinates[objectIndex] && window.geoMap) {
        window.geoMap.setCenter(objectsCoordinates[objectIndex], 14, {
            duration: 500
        });
        
        // Открываем балун соответствующей метки
        const geoObjects = window.geoMap.geoObjects;
        if (geoObjects.getLength() > objectIndex) {
            const placemark = geoObjects.get(objectIndex);
            if (placemark) {
                placemark.balloon.open();
            }
        }
    }
}

// Запасной таймаут для карты географии
setTimeout(() => {
    const geoMapElement = document.querySelector('#geo-map .ymaps-2-1-79-map');
    if (!geoMapElement) {
        showGeoMapError();
    }
}, 5000);