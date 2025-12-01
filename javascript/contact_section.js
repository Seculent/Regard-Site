// Инициализация Яндекс.Карты для контактов
let contactMap = null;
let myPlacemark = null;
let isInitialized = false;

ymaps.ready(initContactMap);

function initContactMap() {
    try {
        console.log('Инициализация карты контактов...');
        
        // Проверяем, загружена ли API Яндекс.Карт
        if (typeof ymaps === 'undefined') {
            throw new Error('Yandex Maps API не загружена');
        }

        // Если карта уже инициализирована, не создаем заново
        if (isInitialized) {
            console.log('Карта уже инициализирована');
            return;
        }

        // Координаты офиса
        const officeCoords = [59.963611, 30.287149];
        
        // Создаем карту с минимальными настройками
        contactMap = new ymaps.Map('map', {
            center: officeCoords,
            zoom: 15,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            searchControlProvider: 'yandex#search',
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true
        });

        // Создаем метку
        myPlacemark = new ymaps.Placemark(officeCoords, {
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
                        <strong>Email:</strong> project@regard-spb.ru
                    </p>
                </div>
            `
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNlZTkzOTMiIGZpbGwtb3BhY2l0eT0iMC44IiBzdHJva2U9IiNiYjBkMGQiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSIjYmIwZDBkIi8+Cjwvc3ZnPg==',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -40],
            balloonCloseButton: true,
            balloonAutoPan: true
        });
        
        // Добавляем метку на карту
        contactMap.geoObjects.add(myPlacemark);
        
        // Настройки поведения карты
        contactMap.behaviors.disable('scrollZoom');
        
        // Добавляем обработчик события изменения размера карты
        contactMap.events.add('fullscreenenter', function() {
            console.log('Полноэкранный режим включен');
            // Принудительно обновляем размер карты
            setTimeout(() => {
                if (contactMap) {
                    contactMap.container.fitToViewport();
                }
            }, 100);
        });
        
        contactMap.events.add('fullscreenexit', function() {
            console.log('Полноэкранный режим выключен');
            // Принудительно обновляем размер карты после выхода из полноэкранного режима
            setTimeout(() => {
                if (contactMap) {
                    contactMap.container.fitToViewport();
                    // Дополнительная проверка через небольшой интервал
                    setTimeout(() => {
                        if (contactMap) {
                            contactMap.container.fitToViewport();
                        }
                    }, 300);
                }
            }, 100);
        });
        
        // Обработчик изменения размера окна
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (contactMap && !contactMap.fullscreen.getState()) {
                    contactMap.container.fitToViewport();
                }
            }, 250);
        });
        
        // Открываем балун при загрузке с небольшой задержкой
        setTimeout(() => {
            if (myPlacemark && !myPlacemark.balloon.isOpen()) {
                myPlacemark.balloon.open();
            }
        }, 1000);
        
        isInitialized = true;
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
            <div class="map-loading" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 20px;
                text-align: center;
                background: rgba(238, 147, 147, 0.1);
                border-radius: 8px;
            ">
                <div class="map-loading-spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #ee9393;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <h3 style="color: #ee9393; margin-bottom: 10px; font-size: 18px;">Ошибка загрузки карты</h3>
                <p style="margin-bottom: 15px; color: #666; font-size: 14px;">Проверьте подключение к интернету</p>
                <a href="https://yandex.ru/maps/?text=Санкт-Петербург, улица Большая Зеленина, 24" 
                   target="_blank" 
                   class="btn btn-outline-light"
                   style="
                        display: inline-block;
                        padding: 10px 20px;
                        background: transparent;
                        border: 1px solid #ee9393;
                        color: #ee9393;
                        text-decoration: none;
                        border-radius: 4px;
                        transition: all 0.3s ease;
                        font-size: 14px;
                   ">
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
        phoneElement.title = 'Нажмите для копирования';
        phoneElement.addEventListener('click', function() {
            copyToClipboard('+74951234567', this);
        });
    }
    
    if (emailElement) {
        emailElement.style.cursor = 'pointer';
        emailElement.title = 'Нажмите для копирования';
        emailElement.addEventListener('click', function() {
            copyToClipboard('project@regard-spb.ru', this);
        });
    }
    
    // Добавляем CSS для анимации спиннера
    if (!document.querySelector('#map-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'map-spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});

// Функция для принудительного обновления размера карты
function updateMapSize() {
    if (contactMap) {
        contactMap.container.fitToViewport();
    }
}

// Запасной таймаут на случай если карта не загрузится
setTimeout(() => {
    const mapElement = document.getElementById('map');
    if (mapElement && !mapElement.querySelector('.ymaps-2-1-79-map') && !isInitialized) {
        showMapError('map');
    }
}, 5000);

// Очищаем карту при размонтировании компонента (если используешь SPA)
window.addEventListener('beforeunload', function() {
    if (contactMap) {
        contactMap.destroy();
        contactMap = null;
        myPlacemark = null;
        isInitialized = false;
    }
});