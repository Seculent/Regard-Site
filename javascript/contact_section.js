// Инициализация Яндекс.Карты
ymaps.ready(init);

function init() {
    // Координаты офиса (замените на реальные)
    const officeCoords = [59.963611, 30.287149]; // Сантк-Петербург
    
    // Создаем карту
    const myMap = new ymaps.Map('map', {
        center: officeCoords,
        zoom: 15,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });

    // Создаем метку
    const myPlacemark = new ymaps.Placemark(officeCoords, {
        hintContent: 'ООО «РЕГАРД»',
        balloonContent: `
    <div style="padding: 15px; color: #333; font-family: Arial, sans-serif;">
        <h3 style="margin-bottom: 10px; color: #2c3e50; font-weight: 600;">ООО «Регард»</h3>
        <p style="margin: 5px 0; color: #666;">
            <strong>📍 Адрес:</strong> 197110, г. Санкт-Петербург, улица Большая Зеленина, 24</p>
        <p style="margin: 5px 0; color: #666;">
            <strong>📞 Телефон:</strong> 
            <span style="cursor: pointer; color: #0066cc; text-decoration: underline;" 
                  onclick="copyToClipboard('+74951234567', this)">+7 (495) 123-45-67</span>
        </p>
        <p style="margin: 5px 0; color: #666;">
            <strong>✉️ Email:</strong> 
            <span style="cursor: pointer; color: #0066cc; text-decoration: underline;" 
                  onclick="copyToClipboard('info@regard.ru', this)">project@regard-spb.ru</span>
        </p>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">
            ⚡ Нажмите на email или телефон, чтобы скопировать
        </p>
    </div>
`
    }, {
        // Стили метки
        iconLayout: 'default#image',
        iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNlZTkzOTMiIGZpbGwtb3BhY2l0eT0iMC44IiBzdHJva2U9IiNiYjBkMGQiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSI4IiBmaWxsPSIjYmIwZDBkIi8+Cjwvc3ZnPg==',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40],
        balloonCloseButton: true
    });
    
    // Добавляем метку на карту
    myMap.geoObjects.add(myPlacemark);
    
    // Открываем балун при загрузке
    myPlacemark.balloon.open();
    
    // Настройки поведения карты
    myMap.behaviors.disable('scrollZoom');
    
    // Устанавливаем дополнительные опции
    myMap.options.set('suppressMapOpenBlock', true);
    
    // Обработчик для полноэкранного режима

}

// Резервная функция на случай ошибки загрузки карты
function showMapError() {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; background: rgba(255,255,255,0.1); border-radius: 8px; height: 100%; display: flex; flex-direction: column; justify-content: center; color: #fff;">
            <h3 style="color: #ee9393; margin-bottom: 10px;">Ошибка загрузки карты</h3>
            <p style="margin-bottom: 15px; color: #ccc;">Проверьте подключение к интернету</p>
            <a href="https://yandex.ru/maps/?text=Москва" 
               target="_blank" 
               style="color: #ee9393; text-decoration: none; font-weight: 500;">
                Посмотреть на Яндекс.Картах →
            </a>
        </div>
    `;
}

// Запасной таймаут на случай если карта не загрузится
setTimeout(() => {
    if (typeof ymaps === 'undefined' || !document.querySelector('.ymaps-2-1-79-map')) {
        showMapError();
    }
}, 5000);

// Функция для копирования текста в буфер обмена
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

// Функция для обновления размера карты при ресайзе
function updateMapSize() {
    if (window.myMap) {
        setTimeout(() => {
            window.myMap.container.fitToViewport();
        }, 100);
    }
}
// ______________________________________________________________________________________
// Плавная прокрутка к секции контактов
document.addEventListener('DOMContentLoaded', function() {
    const contactsBtn = document.getElementById('contactsBtn');
    
    if (contactsBtn) {
        contactsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const contactsSection = document.getElementById('contacts');
            if (contactsSection) {
                // Вычисляем позицию секции с учетом фиксированного header'а
                const headerHeight = document.querySelector('.container_nav').offsetHeight;
                const targetPosition = contactsSection.offsetTop - headerHeight - 20; // 20px дополнительный отступ
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Добавляем обработчик для всех внутренних ссылок (опционально)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Пропускаем ссылки, которые не ведут на существующие элементы
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.container_nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Функция для проверки видимости элемента в viewport (дополнительно)
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Обновление активного пункта меню при скролле (опционально)
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.container_nav').offsetHeight;
            
            if (scrollY >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
