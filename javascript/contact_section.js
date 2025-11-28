// Инициализация Яндекс.Карты для контактов
ymaps.ready(initContactMap);

function initContactMap() {
    try {
        console.log('Инициализация карты контактов...');
        
        // Проверяем, загружена ли API Яндекс.Карт
        if (typeof ymaps === 'undefined') {
            throw new Error('Yandex Maps API не загружена');
        }

        // Координаты офиса
        const officeCoords = [59.963611, 30.287149];
        
        // Создаем карту
        const contactMap = new ymaps.Map('map', {
            center: officeCoords,
            zoom: 15,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем метку
        const myPlacemark = new ymaps.Placemark(officeCoords, {
            hintContent: 'ООО «РЕГАРД»',
            balloonContent: `
                <div style="padding: 15px; color: #333; font-family: Arial, sans-serif;">
                    <h3 style="margin-bottom: 10px; color: #2c3e50; font-size: 20px; font-weight: 100;">ООО «Регард»</h3>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Адрес:</strong> 197110, г. Санкт-Петербург, улица Большая Зеленина, 24
                    </p>
                    <p style="margin: 5px 0; color: #666;">
                        <strong>Телефон:</strong> +7 (495) 123-45-67
                    </p>
                    <p style="margin: 5px 0; color: #666;">
                        <strong> Email:</strong> project@regard-spb.ru
                    </p>
                </div>
            `
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNlZTkzOTMiIGZpbGwtb3BhY2l0eT0iMC44IiBzdHJva2U9IiNiYjBkMGQiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSIjYmIwZDBkIi8+Cjwvc3ZnPg==',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -40],
            balloonCloseButton: true
        });
        
        // Добавляем метку на карту
        contactMap.geoObjects.add(myPlacemark);
        
        // Открываем балун при загрузке
        myPlacemark.balloon.open();
        
        // Настройки поведения карты
        contactMap.behaviors.disable('scrollZoom');
        
        console.log('Карта контактов успешно инициализирована');
        
    } catch (error) {
        console.error('Ошибка инициализации карты контактов:', error);
        showMapError('map');
    }
}

// Функция для отображения ошибки карты
function showMapError(mapId) {
    const mapContainer = document.getElementById(mapId);
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="map-loading">
                <div class="map-loading-spinner"></div>
                <h3 style="color: #ee9393; margin-bottom: 10px;">Ошибка загрузки карты</h3>
                <p style="margin-bottom: 15px; color: #ccc;">Проверьте подключение к интернету</p>
                <a href="https://yandex.ru/maps/?text=Санкт-Петербург, улица Большая Зеленина, 24" 
                   target="_blank" 
                   class="btn btn-outline-light">
                    Посмотреть на Яндекс.Картах
                </a>
            </div>
        `;
    }
}

// Функция для копирования текста в буфер обмена
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        // Сохраняем оригинальный текст
        const originalText = element.textContent;
        
        // Меняем текст на "Скопировано!"
        element.textContent = '✓ Скопировано!';
        element.style.color = '#28a745';
        
        // Возвращаем оригинальный текст через 2 секунды
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '#0066cc';
        }, 2000);
        
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
        alert('Не удалось скопировать текст. Попробуйте выделить и скопировать вручную.');
    });
}

// Добавляем функциональность копирования для контактных данных
document.addEventListener('DOMContentLoaded', function() {
    // Делаем телефон и email кликабельными
    const phoneElement = document.querySelector('.contact-item:nth-child(2) .contact-details p');
    const emailElement = document.querySelector('.contact-item:nth-child(3) .contact-details p');
    
    if (phoneElement) {
        phoneElement.style.cursor = 'pointer';
        phoneElement.addEventListener('click', function() {
            copyToClipboard('+74951234567', this);
        });
    }
    
    if (emailElement) {
        emailElement.style.cursor = 'pointer';
        emailElement.addEventListener('click', function() {
            copyToClipboard('project@regard-spb.ru', this);
        });
    }
});

// Запасной таймаут на случай если карта не загрузится
setTimeout(() => {
    const mapElement = document.querySelector('#map .ymaps-2-1-79-map');
    if (!mapElement) {
        showMapError('map');
    }
}, 5000);