// Mobile optimization for contacts section
document.addEventListener('DOMContentLoaded', function() {
    initMobileContacts();
    initContactInteractions();
});

function initMobileContacts() {
    // Адаптация секции контактов для мобильных
    adaptContactsLayout();
    
    // Обработчики изменения размера и ориентации
    window.addEventListener('resize', debounce(adaptContactsLayout, 250));
    window.addEventListener('orientationchange', function() {
        setTimeout(adaptContactsLayout, 100);
    });
    
    // Инициализация улучшенного UX для контактов
    initEnhancedContactUX();
}

function adaptContactsLayout() {
    const contactsSection = document.querySelector('.contacts-section');
    const contactItems = document.querySelectorAll('.contact-item');
    const mapContainer = document.querySelector('.map-container');
    
    if (!contactsSection) return;
    
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerWidth > window.innerHeight && window.innerWidth <= 968;
    const isVerySmall = window.innerWidth <= 360;
    
    // Адаптация для ландшафтного режима
    if (isMobile && isLandscape) {
        contactsSection.style.padding = '30px 0';
        if (mapContainer) {
            mapContainer.style.height = '250px';
        }
        
        contactItems.forEach(item => {
            item.style.padding = '10px';
            item.style.minHeight = '55px';
        });
    }
    
    // Вертикальное расположение для очень маленьких экранов
    if (isVerySmall) {
        contactItems.forEach(item => {
            item.style.flexDirection = 'column';
            item.style.textAlign = 'center';
            item.style.gap = '8px';
            item.style.padding = '15px 12px';
        });
    } else {
        contactItems.forEach(item => {
            item.style.flexDirection = 'row';
            item.style.textAlign = 'left';
            item.style.gap = '';
            item.style.padding = '';
        });
    }
    
    // Активация компактного режима для очень маленьких экранов
    if (isVerySmall) {
        activateCompactContacts();
    } else {
        deactivateCompactContacts();
    }
}

function initContactInteractions() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Добавляем touch-оптимизацию для контактных элементов
    contactItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        item.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
        
        item.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Инициализация кликабельных контактов
    initClickableContacts();
    
    // Инициализация быстрых действий
    initQuickActions();
}

function initClickableContacts() {
    // Находим контакты с телефоном и email
    const phoneContact = findContactByIcon('📞');
    const emailContact = findContactByIcon('✉️');
    const addressContact = findContactByIcon('📍');
    
    // Делаем телефон и email кликабельными
    if (phoneContact) {
        makeContactClickable(phoneContact, 'phone');
    }
    
    if (emailContact) {
        makeContactClickable(emailContact, 'email');
    }
    
    if (addressContact) {
        makeContactClickable(addressContact, 'address');
    }
}

function findContactByIcon(iconText) {
    const contactItems = document.querySelectorAll('.contact-item');
    for (let item of contactItems) {
        const icon = item.querySelector('.contact-icon');
        if (icon && icon.textContent.includes(iconText)) {
            return item;
        }
    }
    return null;
}

function makeContactClickable(contactItem, type) {
    const details = contactItem.querySelector('.contact-details p');
    if (!details) return;
    
    contactItem.classList.add('clickable');
    
    // Сохраняем оригинальный текст
    const originalText = details.textContent;
    
    contactItem.addEventListener('click', function(e) {
        e.preventDefault();
        
        switch (type) {
            case 'phone':
                handlePhoneClick(originalText, details);
                break;
            case 'email':
                handleEmailClick(originalText, details);
                break;
            case 'address':
                handleAddressClick(originalText, details);
                break;
        }
    });
}

function handlePhoneClick(phoneText, element) {
    // Очищаем номер телефона от лишних символов
    const cleanPhone = phoneText.replace(/[^\d+]/g, '');
    
    // Показываем варианты действий
    showContactActions(element, [
        {
            text: 'Позвонить',
            action: () => {
                window.location.href = `tel:${cleanPhone}`;
            }
        },
        {
            text: 'Скопировать',
            action: () => {
                copyToClipboard(cleanPhone, element);
            }
        }
    ]);
}

function handleEmailClick(emailText, element) {
    const cleanEmail = emailText.trim();
    
    showContactActions(element, [
        {
            text: 'Написать',
            action: () => {
                window.location.href = `mailto:${cleanEmail}`;
            }
        },
        {
            text: 'Скопировать',
            action: () => {
                copyToClipboard(cleanEmail, element);
            }
        }
    ]);
}

function handleAddressClick(addressText, element) {
    showContactActions(element, [
        {
            text: 'Скопировать',
            action: () => {
                copyToClipboard(addressText, element);
            }
        },
        {
            text: 'Открыть в картах',
            action: () => {
                const encodedAddress = encodeURIComponent(addressText);
                window.open(`https://yandex.ru/maps/?text=${encodedAddress}`, '_blank');
            }
        }
    ]);
}

function showContactActions(element, actions) {
    // Удаляем существующие действия
    const existingActions = element.parentNode.querySelector('.contact-actions');
    if (existingActions) {
        existingActions.remove();
    }
    
    // Создаем контейнер для действий
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'contact-actions';
    actionsContainer.style.display = 'flex';
    actionsContainer.style.flexWrap = 'wrap';
    actionsContainer.style.gap = '8px';
    actionsContainer.style.marginTop = '10px';
    
    // Добавляем кнопки действий
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'contact-action-btn';
        button.textContent = action.text;
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            action.action();
            actionsContainer.remove();
        });
        actionsContainer.appendChild(button);
    });
    
    // Вставляем после элемента
    element.parentNode.appendChild(actionsContainer);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (actionsContainer.parentNode) {
            actionsContainer.remove();
        }
    }, 5000);
}

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification('Скопировано в буфер обмена!');
        
        // Визуальный feedback
        if (element) {
            const originalText = element.textContent;
            element.textContent = '✓ Скопировано!';
            element.classList.add('copied');
            
            setTimeout(() => {
                element.textContent = originalText;
                element.classList.remove('copied');
            }, 2000);
        }
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
        showCopyNotification('Ошибка при копировании', true);
    });
}

function showCopyNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `copy-notification ${isError ? 'error' : ''}`;
    notification.innerHTML = `
        <span class="copy-notification-icon">${isError ? '❌' : '✓'}</span>
        <span>${message}</span>
    `;
    
    if (isError) {
        notification.style.background = '#f44336';
    }
    
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

function initQuickActions() {
    // Добавляем быстрые действия в шапку на мобильных
    if (window.innerWidth <= 768) {
        addQuickContactActions();
    }
}

function addQuickContactActions() {
    const contactsSection = document.querySelector('.contacts-section');
    if (!contactsSection) return;
    
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-contact-actions';
    quickActions.style.display = 'flex';
    quickActions.style.justifyContent = 'center';
    quickActions.style.gap = '10px';
    quickActions.style.marginBottom = '20px';
    quickActions.style.flexWrap = 'wrap';
    
    quickActions.innerHTML = `
        <a href="tel:+74951234567" class="quick-action-btn phone">
            <span class="quick-action-icon">📞</span>
            <span>Позвонить</span>
        </a>
        <a href="mailto:project@regard-spb.ru" class="quick-action-btn email">
            <span class="quick-action-icon">✉️</span>
            <span>Написать</span>
        </a>
        <button class="quick-action-btn map" onclick="scrollToMap()">
            <span class="quick-action-icon">📍</span>
            <span>Карта</span>
        </button>
    `;
    
    contactsSection.querySelector('.container').insertBefore(quickActions, contactsSection.querySelector('.contacts-grid'));
    
    // Добавляем стили для быстрых действий
    addQuickActionsStyles();
}

function scrollToMap() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Подсвечиваем карту
        mapContainer.style.boxShadow = '0 0 0 3px rgba(238, 147, 147, 0.5)';
        setTimeout(() => {
            mapContainer.style.boxShadow = '';
        }, 2000);
    }
}

function addQuickActionsStyles() {
    const styles = `
        .quick-action-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: rgba(238, 147, 147, 0.2);
            border: 2px solid #ee9393;
            color: #ee9393;
            text-decoration: none;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
            min-height: 44px;
        }
        
        .quick-action-btn:hover {
            background: #ee9393;
            color: #000;
            transform: translateY(-2px);
        }
        
        .quick-action-btn:active {
            transform: scale(0.95);
        }
        
        .quick-action-icon {
            font-size: 1.1rem;
        }
        
        @media (max-width: 480px) {
            .quick-action-btn {
                padding: 10px 14px;
                font-size: 0.8rem;
                min-height: 40px;
            }
            
            .quick-action-icon {
                font-size: 1rem;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

function activateCompactContacts() {
    // Активируем компактный режим для очень маленьких экранов
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo) return;
    
    contactInfo.classList.add('compact');
}

function deactivateCompactContacts() {
    const contactInfo = document.querySelector('.contact-info');
    if (!contactInfo) return;
    
    contactInfo.classList.remove('compact');
}

function initEnhancedContactUX() {
    // Инициализация улучшенного UX для карты
    initMapEnhancements();
    
    // Добавляем функциональность "tap to call" для телефонов
    initTapToCall();
}

function initMapEnhancements() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // Показываем состояние загрузки
    showMapLoading();
    
    // Скрываем loading через 5 секунд на случай ошибки
    setTimeout(hideMapLoading, 5000);
}

function showMapLoading() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    mapContainer.classList.add('loading');
    mapContainer.innerHTML = `
        <div class="map-loading">
            <div class="map-loading-spinner"></div>
            <p>Загрузка карты...</p>
            <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 10px;">
                Если карта не загружается, проверьте подключение к интернету
            </p>
        </div>
    `;
}

function hideMapLoading() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    mapContainer.classList.remove('loading');
    mapContainer.classList.add('loaded');
    
    // Восстанавливаем оригинальный HTML с картой
    mapContainer.innerHTML = '<div id="map"></div>';
}

function initTapToCall() {
    // Автоматическое определение телефонов в тексте
    const contactTexts = document.querySelectorAll('.contact-details p');
    
    contactTexts.forEach(text => {
        const content = text.textContent;
        // Простой regex для определения номеров телефонов
        const phoneRegex = /[\+]?[7-8]?[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}/g;
        
        if (phoneRegex.test(content)) {
            text.innerHTML = content.replace(phoneRegex, '<a href="tel:$&" style="color: #ee9393; text-decoration: none;">$&</a>');
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

// Интеграция с существующей картой из contact_section.js
function initMapIntegration() {
    // Перехватываем инициализацию карты для добавления мобильной оптимизации
    const originalInit = window.init;
    
    window.init = function() {
        showMapLoading();
        
        // Ждем немного перед инициализацией для лучшего UX
        setTimeout(function() {
            if (typeof originalInit === 'function') {
                originalInit();
            }
            
            // Даем карте время на рендеринг
            setTimeout(hideMapLoading, 1000);
            
            // Добавляем мобильные классы
            if (window.innerWidth <= 768 && window.myMap) {
                window.myMap.container.getElement().classList.add('ymaps-2-1-79-map-mobile');
            }
        }, 500);
    };
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initMapIntegration();
});