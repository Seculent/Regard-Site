// Данные новостей
const newsData = [
    {
        id: 1,
        date: '15.12.2024',
        title: 'Завершение работ на объекте "Лаголово А101"',
        excerpt: 'Успешно завершены геодезические работы на крупном жилом комплексе...',
        fullText: 'Успешно завершены геодезические работы на крупном жилом комплексе "Лаголово А101". Наши специалисты провели полный комплекс мониторинговых мероприятий, обеспечив высокую точность и качество строительных работ.'
    },
    {
        id: 2,
        date: '10.12.2024',
        title: 'Новый партнер - ГК "Самолет"',
        excerpt: 'Заключено партнерское соглашение с крупной строительной компанией...',
        fullText: 'Заключено партнерское соглашение с крупной строительной компанией ГК "Самолет". В рамках сотрудничества мы будем осуществлять геодезическое сопровождение строительства на нескольких объектах компании.'
    },
    {
        id: 3,
        date: '05.12.2024',
        title: 'Обновление оборудования',
        excerpt: 'Компания приобрела новое современное геодезическое оборудование...',
        fullText: 'Компания приобрела новое современное геодезическое оборудование ведущих мировых производителей. Это позволит нам повысить точность измерений и эффективность работы на объектах.'
    },
    {
        id: 4,
        date: '28.11.2024',
        title: 'Сертификация сотрудников',
        excerpt: 'Наши специалисты прошли повышение квалификации...',
        fullText: 'Наши специалисты прошли повышение квалификации и получили сертификаты международного образца. Обучение проводилось на базе ведущего учебного центра.'
    },
    {
        id: 5,
        date: '20.11.2024',
        title: 'Начало работ в "UP-Квартал Воронцовский"',
        excerpt: 'Приступили к геодезическому сопровождению строительства...',
        fullText: 'Приступили к геодезическому сопровождению строительства нового жилого комплекса "UP-Квартал Воронцовский". Проект включает в себя мониторинг деформаций конструкций и контроль точности работ.'
    },
    {
        id: 6,
        date: '15.11.2024',
        title: 'Участие в строительной выставке',
        excerpt: 'Компания приняла участие в международной выставке...',
        fullText: 'Компания приняла участие в международной выставке "Строительство и архитектура", где представила свои услуги и последние реализованные проекты.'
    }
];

// Конфигурация
const config = {
    itemsPerLoad: 3,
    isExpanded: false
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
        loadMoreBtn.addEventListener('click', toggleNews);
    }
}

// Загрузка новостей
function loadNews() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    // Очищаем сетку
    newsGrid.innerHTML = '';
    
    const endIndex = config.isExpanded ? newsData.length : config.itemsPerLoad;
    const newsToShow = newsData.slice(0, endIndex);
    
    newsToShow.forEach((news, index) => {
        const newsCard = createNewsCard(news, index);
        newsGrid.appendChild(newsCard);
    });
    
    updateLoadMoreButton();
}

// Создание карточки новости
function createNewsCard(news, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 col-12';
    
    const card = document.createElement('div');
    card.className = 'news-card h-100';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="news-date">${news.date}</div>
        <div class="news-content">
            <h3 class="news-title-text">${news.title}</h3>
            <div class="news-excerpt">
                <p>${news.excerpt}</p>
            </div>
            <div class="news-full" style="display: none;">
                <p>${news.fullText}</p>
            </div>
            <button class="read-more-btn mt-auto" onclick="toggleReadMore(this)">
                Читать далее
            </button>
        </div>
    `;
    
    col.appendChild(card);
    return col;
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
        button.classList.add('expanded');
    } else {
        excerpt.style.display = '-webkit-box';
        full.style.display = 'none';
        button.textContent = 'Читать далее';
        button.classList.remove('expanded');
    }
}

// Переключение отображения новостей (показать все/свернуть)
function toggleNews() {
    config.isExpanded = !config.isExpanded;
    loadNews();
}

// Обновление состояния кнопки "Загрузить еще/Свернуть"
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    if (config.isExpanded) {
        loadMoreBtn.textContent = 'Свернуть';
        loadMoreBtn.classList.add('collapse');
    } else {
        loadMoreBtn.textContent = 'Загрузить еще';
        loadMoreBtn.classList.remove('collapse');
    }
    
    // Скрываем кнопку если новостей меньше или равно itemsPerLoad
    if (newsData.length <= config.itemsPerLoad) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initNewsSection();
});