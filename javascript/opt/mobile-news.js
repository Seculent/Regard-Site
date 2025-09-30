// Mobile optimization for news section
document.addEventListener('DOMContentLoaded', function() {
    initMobileNews();
    initNewsInteractions();
});

function initMobileNews() {
    // Адаптация секции новостей для мобильных
    adaptNewsLayout();
    
    // Обработчики изменения размера и ориентации
    window.addEventListener('resize', debounce(adaptNewsLayout, 250));
    window.addEventListener('orientationchange', function() {
        setTimeout(adaptNewsLayout, 100);
    });
    
    // Инициализация улучшенного UX
    initEnhancedNewsUX();
}

function adaptNewsLayout() {
    const newsSection = document.querySelector('.news-section');
    const newsGrid = document.querySelector('.news-grid');
    const newsCards = document.querySelectorAll('.news-card');
    
    if (!newsSection || !newsGrid) return;
    
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth <= 968;
    
    // Адаптация для ландшафтного режима
    if (isMobile && isLandscape) {
        newsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        newsGrid.style.gap = '15px';
        
        newsCards.forEach(card => {
            card.style.minHeight = '140px';
            card.style.padding = '12px';
        });
    } else if (isMobile) {
        newsGrid.style.gridTemplateColumns = '1fr';
        newsGrid.style.gap = '20px';
    }
    
    // Оптимизация количества отображаемых символов для очень маленьких экранов
    if (window.innerWidth <= 360) {
        newsCards.forEach(card => {
            const excerpt = card.querySelector('.news-excerpt');
            if (excerpt) {
                excerpt.style.webkitLineClamp = '5';
            }
        });
    }
}

function initNewsInteractions() {
    const newsCards = document.querySelectorAll('.news-card');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Добавляем touch-оптимизацию для карточек новостей
    newsCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
        
        card.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Улучшаем кнопки "Читать далее"
    readMoreBtns.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        btn.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Оптимизация кнопки "Загрузить еще"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        loadMoreBtn.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    }
}

function initEnhancedNewsUX() {
    // Добавляем функциональность "pull to refresh" для мобильных
    initPullToRefresh();
    
    // Добавляем бесконечный скролл для мобильных
    initInfiniteScroll();
    
    // Оптимизация отображения длинного текста
    optimizeTextDisplay();
}

function initPullToRefresh() {
    const newsSection = document.querySelector('.news-section');
    if (!newsSection || window.innerWidth > 768) return;
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    newsSection.addEventListener('touchstart', function(e) {
        // Проверяем, находимся ли мы вверху страницы
        if (window.scrollY <= 100) {
            startY = e.touches[0].clientY;
            isDragging = true;
        }
    }, { passive: true });
    
    newsSection.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        // Показываем индикатор обновления только при скролле вниз
        if (diff > 50) {
            e.preventDefault();
        }
    }, { passive: false });
    
    newsSection.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const diff = currentY - startY;
        
        // Если скролл достаточно большой, обновляем новости
        if (diff > 100) {
            refreshNews();
        }
        
        isDragging = false;
        startY = 0;
        currentY = 0;
    }, { passive: true });
}

function refreshNews() {
    const newsGrid = document.querySelector('.news-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (!newsGrid) return;
    
    // Показываем индикатор обновления
    showRefreshIndicator();
    
    // Имитация обновления данных
    setTimeout(() => {
        // В реальном приложении здесь был бы запрос к API
        hideRefreshIndicator();
        
        // Показываем уведомление об успешном обновлении
        showRefreshNotification('Новости обновлены');
    }, 1000);
}

function showRefreshIndicator() {
    let indicator = document.querySelector('.refresh-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'refresh-indicator';
        indicator.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Обновление новостей...</span>
        `;
        document.querySelector('.news-section').prepend(indicator);
    }
    
    indicator.style.display = 'flex';
}

function hideRefreshIndicator() {
    const indicator = document.querySelector('.refresh-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

function showRefreshNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'refresh-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function initInfiniteScroll() {
    if (window.innerWidth > 768) return;
    
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn || loadMoreBtn.disabled) return;
    
    let isLoading = false;
    
    window.addEventListener('scroll', debounce(() => {
        if (isLoading) return;
        
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const threshold = 300; // Загружать когда до конца осталось 300px
        
        if (scrollPosition >= pageHeight - threshold) {
            loadMoreNews();
        }
    }, 100));
    
    function loadMoreNews() {
        if (isLoading) return;
        
        isLoading = true;
        loadMoreBtn.classList.add('loading');
        
        // Имитация загрузки
        setTimeout(() => {
            // В реальном приложении здесь был бы запрос к API
            if (typeof window.loadMoreNews === 'function') {
                window.loadMoreNews();
            }
            
            isLoading = false;
            loadMoreBtn.classList.remove('loading');
        }, 1000);
    }
}

function optimizeTextDisplay() {
    const newsContents = document.querySelectorAll('.news-content');
    
    newsContents.forEach(content => {
        const excerpt = content.querySelector('.news-excerpt');
        const fullText = content.querySelector('.news-full');
        const readMoreBtn = content.querySelector('.read-more-btn');
        
        if (!excerpt || !fullText || !readMoreBtn) return;
        
        // Проверяем, нужно ли вообще показывать кнопку "Читать далее"
        const excerptHeight = excerpt.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(excerpt).lineHeight);
        const maxLines = parseInt(excerpt.style.webkitLineClamp) || 3;
        
        if (excerptHeight <= lineHeight * maxLines) {
            readMoreBtn.style.display = 'none';
        }
    });
}

// Вспомогательная функция для ограничения частоты вызовов
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// CSS для индикаторов (добавляется динамически)
function addMobileNewsStyles() {
    const styles = `
        .refresh-indicator {
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 10px;
            margin-bottom: 20px;
            gap: 10px;
        }
        
        .refresh-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100px);
            background: #ee9393;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 10000;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        .refresh-notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        @media (max-width: 768px) {
            .refresh-indicator {
                margin: 0 15px 20px 15px;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    addMobileNewsStyles();
});