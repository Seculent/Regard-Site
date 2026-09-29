// УНИКАЛЬНЫЕ функции для реквизитов
    function copyAllRequisites() {
        // Получаем текст из скрытого блока
        let copyText = document.getElementById('legalCopyContent').textContent;
        
        // Нормализуем переводы строк для Windows/Word
        // Заменяем все варианты переводов строк на \r\n
        copyText = copyText.replace(/\r?\n|\r/g, '\r\n');
        
        // Убираем лишние пробелы в начале/конце строк
        copyText = copyText.split('\r\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\r\n');
        
        // Копируем через временный textarea
        const textArea = document.createElement('textarea');
        textArea.value = copyText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(copyText).then(() => {
                    showCopyNotification('Все реквизиты скопированы!');
                });
            } else {
                document.execCommand('copy');
                showCopyNotification('Все реквизиты скопированы!');
            }
        } catch (err) {
            console.error('Copy failed:', err);
            showCopyNotification('Ошибка копирования');
        } finally {
            document.body.removeChild(textArea);
        }
    }

        // Функция для копирования отдельных полей
        function copySingleField(text) {
            // Для отдельных полей копируем как есть
            navigator.clipboard.writeText(text).then(() => {
                showCopyNotification('Скопировано!');
            }).catch(err => {
                console.error('Clipboard API error:', err);
                fallbackCopyToClipboard(text);
            });
        }

        // Fallback метод для старых браузеров
        function fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // Стили, чтобы textarea не был виден
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showCopyNotification(successful ? 'Скопировано!' : 'Ошибка копирования');
                }
            } catch (err) {
                console.error('Fallback copy error:', err);
                showCopyNotification('Ошибка копирования');
            }
            
            document.body.removeChild(textArea);
        }

        document.addEventListener('DOMContentLoaded', function() {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'copyLiveRegion';
            liveRegion.className = 'visually-hidden';
            liveRegion.setAttribute('role', 'status');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        });
        // Функция для показа уведомления (без alert)
        function showCopyNotification(message) {
            const liveRegion = document.getElementById('copyLiveRegion');

            if (liveRegion) {
                liveRegion.textContent = '';
                window.setTimeout(() => {
                    liveRegion.textContent = message;
                }, 0);
            }
            // Создаем или находим контейнер для уведомлений
            let notificationContainer = document.getElementById('copyNotificationContainer');
            
            if (!notificationContainer) {
                notificationContainer = document.createElement('div');
                notificationContainer.id = 'copyNotificationContainer';
                notificationContainer.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                `;
                document.body.appendChild(notificationContainer);
            }
            
            // Создаем уведомление
            const notification = document.createElement('div');
            notification.style.cssText = `
                background: rgba(25, 135, 84, 0.9);
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                margin-top: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: sans-serif;
                font-size: 14px;
                animation: slideIn 0.3s ease;
            `;
            
            notification.textContent = message;
            notificationContainer.appendChild(notification);
            
            // Удаляем уведомление через 2 секунды
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }

    // Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .copy-field-legal {
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .copy-field-legal:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        .copy-field-legal.copied {
            background-color: rgba(255, 193, 7, 0.2) !important;
        }
    `;
    document.head.appendChild(style);

    // Клик по любому полю с классом copy-field-legal (УНИКАЛЬНЫЙ класс)
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.copy-field-legal').forEach(field => {
            field.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const textToCopy = this.textContent.trim();
                
                // Визуальный эффект
                this.classList.add('copied');
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 200);
                
                // Копируем текст
                copySingleField(textToCopy);
            });
            
            // Добавляем атрибут title для подсказки
            field.setAttribute('title', 'Нажмите для копирования');
            field.setAttribute('role', 'button');
            field.setAttribute('tabindex', '0');
            field.setAttribute('aria-label', 'Скопировать: ' + field.textContent.trim());

            field.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    field.click();
                }
            });
            
            // Для элементов без курсора по умолчанию
            if (!field.style.cursor) {
                field.style.cursor = 'pointer';
            }
        });
    });

        // Предотвращаем автоматическое открытие PDF и стандартное поведение ссылок
        document.addEventListener('DOMContentLoaded', function() {
            // 1. Обработчик для PDF ссылок в навигации
            const pdfLinks = document.querySelectorAll('[data-bs-target="#pdfModal"]');
            
            pdfLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                
                // Дополнительная защита для ссылок с href="#"
                if (link.hasAttribute('href') && link.getAttribute('href') === '#') {
                    link.addEventListener('mousedown', function(e) {
                        e.preventDefault();
                    });
                    link.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                    }, { passive: false });
                }
            });
            
            // 2. Предотвращаем открытие по хэшу в URL
            if (window.location.hash === '#pdfModal') {
                window.location.hash = '';
            }
            
            // 3. Обработчик для самой модалки
            const pdfModal = document.getElementById('pdfModal');
            if (pdfModal) {
                // Предотвращаем любые действия с iframe кроме открытия через кнопку
                pdfModal.addEventListener('show.bs.modal', function() {
                });
                
                pdfModal.addEventListener('hidden.bs.modal', function() {
                    // Очищаем iframe при закрытии модалки
                    const iframe = document.getElementById('pdfViewer');
                    if (iframe) {
                        iframe.src = iframe.src;
                    }
                });
            }
            
            // 4. Дополнительная проверка при загрузке страницы
            window.addEventListener('load', function() {
                // Если модалка почему-то открыта автоматически - закрываем ее
                if (document.body.classList.contains('modal-open') && 
                    document.querySelector('#pdfModal.show')) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('pdfModal'));
                    if (modal) {
                        modal.hide();
                    }
                }
            });
        });

        // Обработчик скролла для навигации
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar-custom');
            const scrollPosition = window.scrollY;
            const navbarHeight = navbar.offsetHeight;
            
            // Когда навигация уходит за верх окна - фиксируем ее
            if (scrollPosition > navbarHeight) {
                navbar.classList.add('fixed-top');
            } else {
                navbar.classList.remove('fixed-top');
            }
        });
        // Упрощенный скрипт для модалки изображений
        document.addEventListener('DOMContentLoaded', function() {
            const imageModal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            
            // Обработчик открытия модалки с изображением
            imageModal.addEventListener('show.bs.modal', function(event) {
                const button = event.relatedTarget;
                const imageSrc = button.getAttribute('data-image');
                modalImage.src = imageSrc;
            });

            // Очистка при закрытии
            imageModal.addEventListener('hidden.bs.modal', function() {
                modalImage.src = '';
            });

            // Убираем обводку при фокусе на кнопках сертификатов
            const certButtons = document.querySelectorAll('.btn-sert');
            certButtons.forEach(button => {
                button.addEventListener('focus', function() {
                    this.style.outline = 'none';
                });
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
            const navbar = document.querySelector('.navbar-custom');
            if (!navbar) return;

            // Функция плавной прокрутки к элементу с учётом навигации
            function smoothScrollToElement(targetElement) {
                if (!targetElement) return;

                const navbarHeight = navbar.offsetHeight;
                const navbarWillLeaveFlow = !navbar.classList.contains('fixed-top');
                const rect = targetElement.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;
                const layoutShiftCompensation = navbarWillLeaveFlow ? navbarHeight : 0;
                const targetPosition = Math.max(
                    0,
                    absoluteTop - navbarHeight - layoutShiftCompensation
                );

                // Отменяем текущую плавную прокрутку, если она идёт
                if ('scrollBehavior' in document.documentElement.style) {
                    // Современные браузеры: устанавливаем мгновенно, чтобы прервать анимацию
                    window.scrollTo(0, window.scrollY);
                }

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }

            // Обработчик для всех внутренних якорей (включая #, но исключая модальные ссылки)
            function handleAnchorClick(e) {
                const link = e.currentTarget;
                const targetId = link.getAttribute('href');
                
                // Пропускаем пустые ссылки или ссылки только с #
                if (!targetId || targetId === '#') {
                    e.preventDefault();
                    smoothScrollToElement(document.body); // прокрутка наверх
                    return;
                }

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    smoothScrollToElement(targetSection);
                }
            }

            // Навешиваем обработчик на все ссылки с href, начинающимся с #, кроме тех, что открывают модалки
            document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(link => {
                // Удаляем старые обработчики, чтобы избежать дублирования (если скрипт выполняется повторно)
                link.removeEventListener('click', handleAnchorClick);
                link.addEventListener('click', handleAnchorClick);
            });

            // Анимация появления элементов при скролле
            const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animated');
                            entry.target.style.animationPlayState = 'running';
                        }
                    });
                }, observerOptions);
                
                // Наблюдаем за анимированными элементами
                document.querySelectorAll('.animate-on-scroll').forEach(el => {
                    observer.observe(el);
                });
        });
