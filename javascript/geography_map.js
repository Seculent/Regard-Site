// Инициализация карты географии объектов
ymaps.ready(initGeoMap);

function initGeoMap() {
    try {
        console.log('Инициализация карты географии...');
        
        const geoMap = new ymaps.Map('geo-map', {
            center: [59.939095, 30.315868],
            zoom: 9,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем метки для объектов
        const objects = [
            {
                coords: [59.729722, 29.834722],
                title: 'Лаголово А101',
                content: 'деревня Лаголово, Лаголовское сельское поселение, Ломоносовский район, Ленинградская область',
                markerColor: '#ed4545'
            },
            {
                coords: [59.750839, 30.588553],
                title: 'Живи в Песочном!',
                content: 'Колпино, Санкт-Петербург',
                markerColor: '#2b90e8'
            },
            {
                coords: [60.051389, 30.485556],
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
        
        console.log('Карта географии успешно инициализирована');
        
    } catch (error) {
        console.error('Ошибка инициализации карты географии:', error);
        showGeoMapError();
    }
}

// Функция для отображения ошибки карты
function showGeoMapError() {
    const mapContainer = document.getElementById('geo-map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="d-flex flex-column justify-content-center align-items-center h-100 text-center text-white p-4">
                <h3 class="text-danger mb-3">Ошибка загрузки карты</h3>
                <p class="mb-3">Не удалось загрузить карту объектов</p>
                <a href="https://yandex.ru/maps/2/saint-petersburg/" 
                   target="_blank" 
                   class="btn btn-outline-light">
                    Посмотреть на Яндекс.Картах
                </a>
            </div>
        `;
    }
}

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
        [59.729722, 29.834722],
        [59.750839, 30.588553],
        [60.051389, 30.485556]
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