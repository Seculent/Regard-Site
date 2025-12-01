// Инициализация Яндекс.Карты для контактов
let contactMap = null;
let myPlacemark = null;
let isInitialized = false;
let isInFullscreen = false;
let mapContainer = null;

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

        // Получаем контейнер карты
        mapContainer = document.getElementById('map');
        if (!mapContainer) {
            throw new Error('Контейнер карты не найден');
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
        
        // Обработчики для полноэкранного режима
        setupFullscreenHandlers();
        
        // Открываем балун при загрузке с небольшой задержкой
        setTimeout(() => {
            if (myPlacemark && !myPlacemark.balloon.isOpen()) {
                myPlacemark.balloon.open();
            }
        }, 1000);
        
        // Устанавливаем фиксированные размеры карты
        setTimeout(() => {
            forceMapSize();
        }, 500);
        
        isInitialized = true;
        console.log('Карта контактов успешно инициализирована');
        
    } catch (error) {
        console.error('Ошибка инициализации карты контактов:', error);
        showMapError('map');
    }
}

// Настройка обработчиков полноэкранного режима
function setupFullscreenHandlers() {
    if (!contactMap) return;
    
    // Обработчик входа в полноэкранный режим
    contactMap.events.add('fullscreenenter', function() {
        console.log('Полноэкранный режим включен');
        isInFullscreen = true;
        
        // Принудительно устанавливаем высоту для полноэкранного режима
        setTimeout(() => {
            if (mapContainer) {
                const parent = mapContainer.parentElement;
                if (parent) {
                    parent.style.height = '100vh';
                }
                mapContainer.style.height = '100vh';
            }
        }, 50);
    });
    
    // Обработчик выхода из полноэкранного режима
    contactMap.events.add('fullscreenexit', function() {
        console.log('Полноэкранный режим выключен');
        isInFullscreen = false;
        
        // Восстанавливаем оригинальные размеры
        setTimeout(() => {
            restoreMapSize();
            
            // Дополнительный вызов через небольшой интервал
            setTimeout(() => {
                restoreMapSize();
                if (contactMap) {
                    contactMap.container.fitToViewport();
                }
            }, 200);
        }, 100);
    });
    
    // Обработчик изменения размера окна (с debounce)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isInFullscreen && contactMap) {
                restoreMapSize();
                contactMap.container.fitToViewport();
            }
        }, 250);
    });
}

// Восстановление оригинального размера карты
function restoreMapSize() {
    if (!mapContainer) return;
    
    const parent = mapContainer.parentElement;
    if (parent) {
        // Возвращаем родительскому контейнеру его оригинальные стили
        parent.style.height = '';
        parent.style.maxHeight = '';
        parent.style.minHeight = '';
    }
    
    // Возвращаем карте оригинальные стили
    mapContainer.style.height = '';
    mapContainer.style.maxHeight = '';
    mapContainer.style.minHeight = '';
    
    // Устанавливаем фиксированные размеры
    setTimeout(() => {
        forceMapSize();
    }, 50);
}

// Принудительная установка размера карты
function forceMapSize() {
    if (!mapContainer || isInFullscreen) return;
    
    const parent = mapContainer.parentElement;
    if (!parent) return;
    
    // Получаем стили родительского контейнера
    const parentStyle = window.getComputedStyle(parent);
    const parentHeight = parent.offsetHeight;
    
    // Устанавливаем высоту карты на 100% высоты родителя
    if (parentHeight > 0) {
        mapContainer.style.height = parentHeight + 'px';
        mapContainer.style.minHeight = '300px'; // Минимальная высота
        mapContainer.style.maxHeight = '600px'; // Максимальная высота
    }
    
    // Обновляем размеры карты
    if (contactMap) {
        setTimeout(() => {
            contactMap.container.fitToViewport();
        }, 100);
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
        const originalColor = element.style.color;
        
        // Меняем текст на "Скопировано!"
        element.textContent = '✓ Скопировано!';
        element.style.color = '#ffffffff';
        
        // Возвращаем оригинальный текст через 0.5 секунды
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = originalColor || '#fff';
        }, 500);
        
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
        alert('Не удалось скопировать текст. Попробуйте выделить и скопировать вручную.');
    });
}

// Добавляем функциональность копирования для ВСЕХ контактных данных
document.addEventListener('DOMContentLoaded', function() {
    // Находим все контактные элементы
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach((item, index) => {
        // Находим текстовый элемент внутри каждого контактного элемента
        const textElement = item.querySelector('.contact-details p');
        
        if (textElement) {
            // Определяем, какой текст копировать в зависимости от позиции элемента
            let textToCopy = '';
            
            switch(index) {
                case 0: // Адрес
                    textToCopy = '197110, г. Санкт-Петербург, улица Большая Зеленина, 24';
                    break;
                case 1: // Телефон
                    textToCopy = '+7 (495) 123-45-67';
                    break;
                case 2: // Email
                    textToCopy = 'project@regard-spb.ru';
                    break;
                case 3: // График работы
                    textToCopy = 'Пн-Пт: 9:00 - 18:00';
                    break;
                default:
                    textToCopy = textElement.textContent.trim();
            }
            
            // Делаем элемент кликабельным
            textElement.style.cursor = 'pointer';
            textElement.title = 'Нажмите для копирования';
            
            // Добавляем эффект при наведении
            item.classList.add('clickable');
            
            // Добавляем обработчик клика
            textElement.addEventListener('click', function(e) {
                e.stopPropagation(); // Останавливаем всплытие
                copyToClipboard(textToCopy, this);
            });
            
            // Также можно кликать на весь контактный блок
            item.addEventListener('click', function(e) {
                if (e.target !== textElement && !textElement.contains(e.target)) {
                    copyToClipboard(textToCopy, textElement);
                }
            });
        }
    });
    
    // Добавляем CSS для анимации спиннера
    if (!document.querySelector('#map-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'map-spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Стили для кликабельных контактных элементов */
            .contact-item.clickable {
                transition: all 0.3s ease;
            }
            
            .contact-item.clickable:hover {
                background: rgba(255, 255, 255, 0.05) !important;
            }
            
            .contact-item.clickable .contact-details p {
                transition: color 0.3s ease;
                position: relative;
            }
            
            .contact-item.clickable .contact-details p.copied {
                color: #ffffffff !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Принудительно устанавливаем размер карты при загрузке
    setTimeout(() => {
        if (mapContainer) {
            forceMapSize();
        }
    }, 1000);
});

// Функция для принудительного обновления размера карты
function updateMapSize() {
    if (contactMap && !isInFullscreen) {
        restoreMapSize();
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
        mapContainer = null;
        isInitialized = false;
        isInFullscreen = false;
    }
});

// Экспортируем функцию обновления размера для использования извне
window.updateContactMapSize = updateMapSize;