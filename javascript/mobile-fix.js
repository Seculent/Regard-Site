// Функция для фикса отступов на мобильных браузерах
function fixMobileLayout() {
    const navbar = document.querySelector('.navbar-custom');
    const heroSection = document.querySelector('.hero-section');
    
    if (!navbar || !heroSection) return;
    
    const navbarHeight = navbar.offsetHeight;
    const isMobile = window.innerWidth <= 768;
    
    // Определяем браузер
    const userAgent = navigator.userAgent.toLowerCase();
    const isOpera = userAgent.includes('opr') || userAgent.includes('opera');
    const isTelegram = userAgent.includes('telegram') || 
                       userAgent.includes('webview') || 
                       window.TelegramWebviewProxy !== undefined;
    const isInstagram = userAgent.includes('instagram');
    const isFacebook = userAgent.includes('fban') || userAgent.includes('fbav');
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    
    if (isMobile) {
        let additionalPadding = 20; // базовый дополнительный отступ
        
        // Специальные настройки для разных браузеров
        if (isOpera) {
            additionalPadding = 40; // Opera GX требует больше места
        } else if (isTelegram) {
            additionalPadding = 60; // Telegram WebView имеет большую панель
        } else if (isInstagram || isFacebook) {
            additionalPadding = 50; // Социальные браузеры
        } else if (isIOS && isSafari) {
            additionalPadding = 30; // Safari на iOS
        }
        
        const totalPadding = navbarHeight + additionalPadding;
        
        // Применяем отступ
        heroSection.style.paddingTop = totalPadding + 'px';
        
        console.log('Mobile layout fix applied:', {
            browser: isOpera ? 'Opera' : isTelegram ? 'Telegram' : isInstagram ? 'Instagram' : isFacebook ? 'Facebook' : 'Other',
            navbarHeight,
            additionalPadding,
            totalPadding
        });
    } else {
        // На десктопе сбрасываем кастомные отступы
        heroSection.style.paddingTop = '';
    }
}

// Функция для применения safe-area-inset (современный способ)
function applySafeAreaInsets() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Добавляем CSS переменные для safe-area
    if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
        heroSection.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
        heroSection.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    fixMobileLayout();
    applySafeAreaInsets();
    
    // Также применяем при изменении размера окна
    window.addEventListener('resize', fixMobileLayout);
    window.addEventListener('orientationchange', function() {
        // Задержка для стабилизации ориентации
        setTimeout(fixMobileLayout, 300);
    });
    
    // Дополнительная проверка после полной загрузки
    window.addEventListener('load', function() {
        setTimeout(fixMobileLayout, 100);
    });
});

// Экспорт для возможного использования в других скриптах
window.mobileLayoutFix = {
    apply: fixMobileLayout,
    refresh: function() {
        fixMobileLayout();
        applySafeAreaInsets();
    }
};