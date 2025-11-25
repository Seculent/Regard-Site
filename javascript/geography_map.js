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
                coords: [59.960557, 30.285640],
                title: 'Квартал AVANT',
                content: 'Пионерская улица, 53, Санкт-Петербург',
                markerColor: '#ff0000ff'
            },
            {
                coords: [59.729722, 29.834722],
                title: 'ЖК "А101 Лаголово',
                content: 'Деревня Лаголово, Лаголовское сельское поселение, Ломоносовский район, Ленинградская область',
                markerColor: '#ff0000ff'
            },
            {
                coords: [60.073872, 30.431324],
                title: 'ЖК "Новые Лаврики"',
                content: 'Жилой комплекс Новые Лаврики, 1.3, Мурино, Всеволожский район, Ленинградская область',
                markerColor: '#ff0000ff'
            },
            {
                coords: [60.117889, 30.174842],
                title: 'ЖК "Курортный Квартал"',
                content: 'Поселок Песочный, Курортный район, Санкт-Петербург ул. Садовая 90',
                markerColor: '#ff0000ff'
            },
            {
                coords: [60.051389, 30.485556],
                title: 'UP-Квартал Воронцовский',
                content: 'Деревня Новое Девяткино, Всеволожский район, Ленинградская область',
                markerColor: '#ff0000ff'
            },
            {
                coords: [59.749296, 30.570305],
                title: 'ЖК "Колпино-10"',
                content: 'Санкт-Петербург, внутригородское муниципальное образование Санкт-Петербурга город Колпино, проспект Ленина, земельный участок 60а',
                markerColor: '#ff0000ff'
            },
            {
                coords: [59.864626, 30.553859],
                title: 'ЖК "Новосаратовка"',
                content: 'Ленинградская область, Всеволожский муниципальный район, Свердловское городское поселение, деревня Новосаратовка',
                markerColor: '#ff0000ff'
            },
            {
                coords: [59.776284, 30.600095],
                title: 'ЖК "Красный Кирпичник"',
                content: 'Санкт-Петербург, город Колпино, Загородная улица, участок 33',
                markerColor: '#ff0000ff'
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
        [59.960557, 30.285640],
        [59.729722, 29.834722],
        [60.073872, 30.431324],
        [60.117889, 30.174842],
        [60.051389, 30.485556],
        [59.749296, 30.570305],
        [59.864626, 30.553859],
        [59.776284, 30.600095]
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