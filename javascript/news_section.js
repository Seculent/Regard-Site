// Данные новостей (в реальном проекте можно получать с сервера)
const newsData = [
    {
        id: 1,
        date: '15.12.2024',
        title: 'Завершение работ на объекте "Лаголово А101"',
        excerpt: 'Успешно завершены геодезические работы на крупном жилом комплексе...',
        fullText: 'Успешно завершены геодезические работы на крупном жилом комплексе "Лаголово А101". Наши специалисты провели полный комплекс мониторинговых мероприятий, обеспечив высокую точность и качество строительных работ. Проект реализован в установленные сроки с соблюдением всех нормативных требований.'
    },
    {
        id: 2,
        date: '10.12.2024',
        title: 'Новый партнер - ГК "Самолет"',
        excerpt: 'Заключено партнерское соглашение с крупной строительной компанией...',
        fullText: 'Заключено партнерское соглашение с крупной строительной компанией ГК "Самолет". В рамках сотрудничества мы будем осуществлять геодезическое сопровождение строительства на нескольких объектах компании в Санкт-Петербурге и Ленинградской области.'
    },
    {
        id: 3,
        date: '05.12.2024',
        title: 'Обновление оборудования',
        excerpt: 'Компания приобрела новое современное геодезическое оборудование...',
        fullText: 'Компания приобрела новое современное геодезическое оборудование ведущих мировых производителей. Это позволит нам повысить точность измерений и эффективность работы на объектах. В парк оборудования вошли электронные тахеометры, GPS-приемники и системы лазерного сканирования.'
    },
    {
        id: 4,
        date: '28.11.2024',
        title: 'Сертификация сотрудников',
        excerpt: 'Наши специалисты прошли повышение квалификации...',
        fullText: 'Наши специалисты прошли повышение квалификации и получили сертификаты международного образца. Обучение проводилось на базе ведущего учебного центра и включало в себя освоение новых методик геодезического мониторинга и работы с современным оборудованием.'
    },
    {
        id: 5,
        date: '20.11.2024',
        title: 'Начало работ в "UP-Квартал Воронцовский"',
        excerpt: 'Приступили к геодезическому сопровождению строительства...',
        fullText: 'Приступили к геодезическому сопровождению строительства нового жилого комплекса "UP-Квартал Воронцовский". Проект включает в себя мониторинг деформаций конструкций, исполнительную съемку и контроль точности строительно-монтажных работ.'
    },
    {
        id: 6,
        date: '15.11.2024',
        title: 'Участие в строительной выставке',
        excerpt: 'Компания приняла участие в международной выставке...',
        fullText: 'Компания приняла участие в международной выставке "Строительство и архитектура", где представила свои услуги и последние реализованные проекты. Мероприятие позволило установить новые деловые контакты и обсудить перспективы сотрудничества.'
    }
];

// Конфигурация
const config = {
    itemsPerLoad: 3,
    currentPage: 1
};

// Инициализация новостного раздела
function initNewsSection() {
    const newsGrid = document.getElementById('newsGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const newsCount = document.getElementById('newsCount');
    
    if (!newsGrid) return;
    
    // Показываем общее количество новостей
    if (newsCount) {
        newsCount.textContent = `Всего новостей: ${newsData.length}`;
    }
    
    // Загружаем первые новости
    loadNews();
    
    // Обработчик кнопки "Загрузить еще"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNews);
    }
    
    // Проверяем, нужно ли скрыть кнопку после первой загрузки
    updateLoadMoreButton();
}

// Загрузка новостей
function loadNews() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    const startIndex = (config.currentPage - 1) * config.itemsPerLoad;
    const endIndex = startIndex + config.itemsPerLoad;
    const newsToShow = newsData.slice(startIndex, endIndex);
    
    newsToShow.forEach(news => {
        const newsCard = createNewsCard(news);
        newsGrid.appendChild(newsCard);
    });
    
    config.currentPage++;
    updateLoadMoreButton();
}

// Создание карточки новости
function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.style.animationDelay = `${Math.random() * 0.3}s`;
    
    card.innerHTML = `
        <div class="news-date">${news.date}</div>
        <div class="news-content">
            <h3>${news.title}</h3>
            <div class="news-excerpt">
                <p>${news.excerpt}</p>
            </div>
            <div class="news-full" style="display: none;">
                <p>${news.fullText}</p>
            </div>
            <button class="read-more-btn" onclick="toggleReadMore(this)">Читать далее</button>
        </div>
    `;
    
    return card;
}

// Переключение режима "Читать далее/Свернуть"
function toggleReadMore(button) {
    const card = button.closest('.news-card');
    const excerpt = card.querySelector('.news-excerpt');
    const full = card.querySelector('.news-full');
    
    if (full.style.display === 'none') {
        excerpt.style.display = 'none';
        full.style.display = 'block';
        button.textContent = 'Свернуть';
    } else {
        excerpt.style.display = '-webkit-box';
        full.style.display = 'none';
        button.textContent = 'Читать далее';
    }
}

// Загрузка дополнительных новостей
function loadMoreNews() {
    loadNews();
}

// Обновление состояния кнопки "Загрузить еще"
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    const totalLoaded = (config.currentPage - 1) * config.itemsPerLoad;
    if (totalLoaded >= newsData.length) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Все новости загружены';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initNewsSection);