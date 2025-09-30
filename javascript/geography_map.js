// Добавьте этот код в новый файл geography_map.js и подключите его после contact_section.js

// Инициализация карты географии объектов
ymaps.ready(initGeoMap);

function initGeoMap() {
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
            markerColor: '#ed4545ff'
        },
        {
            coords: [59.750839, 30.588553], // Колпино
            title: 'Живи в Песочном!',
            content: 'Колпино, Санкт-Петербург',
            markerColor: '#2b90e8ff'
        },
        {
            coords: [60.051389, 30.485556], // Новое Девяткино
            title: 'UP-Квартал Воронцовский',
            content: 'деревня Новое Девяткино, Всеволожский район, Ленинградская область',
            markerColor: '#11f305ff'
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
    });

    // Адаптация карты для мобильных устройств
    if (window.innerWidth < 768) {
        geoMap.behaviors.disable('drag');
        geoMap.behaviors.disable('scrollZoom');
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            geoMap.behaviors.disable('drag');
            geoMap.behaviors.disable('scrollZoom');
        } else {
            geoMap.behaviors.enable('drag');
            geoMap.behaviors.enable('scrollZoom');
        }
    });
}

// Функция для добавления новой точки (для администратора)
function addNewObject(coords, title, content, markerColor = '#ee9393') {
    // Эта функция может быть использована для добавления новых объектов через админ-панель
    const newObject = {
        coords: coords,
        title: title,
        content: content,
        markerColor: markerColor
    };
    
    // Здесь будет код для добавления новой точки на карту и в список объектов
    console.log('Добавление нового объекта:', newObject);
}

// Добавьте в конец geography_map.js
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

// Вызовите эту функцию после инициализации карты
// Добавьте в конец функции initGeoMap():
if (window.innerWidth <= 768) {
    optimizeMapForMobile();
}

// Обработчик изменения размера
window.addEventListener('resize', function() {
    if (window.geoMap) {
        optimizeMapForMobile();
    }
});