let newsData = [];

// Конфигурация
const config = {
    itemsPerLoad: 3,
    isExpanded: false
};

// Инициализация новостного раздела
async function initNewsSection() {
    try {
        newsData = (await window.RegardContent.news()).filter(news => news.published !== false);
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        return;
    }
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