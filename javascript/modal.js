// Функция для открытия модального окна
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Ждем загрузки изображения перед сбросом зума
    modalImage.onload = function() {
        resetZoom();
    };
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
}

// Переменные для управления зумом
let currentScale = 1;
const minScale = 0.5;
const maxScale = 3;
const scaleStep = 0.2;

// Функция для увеличения изображения
function zoomIn() {
    const prevScale = currentScale;
    currentScale = Math.min(currentScale + scaleStep, maxScale);
    applyZoom(prevScale);
}

// Функция для уменьшения изображения
function zoomOut() {
    const prevScale = currentScale;
    currentScale = Math.max(currentScale - scaleStep, minScale);
    applyZoom(prevScale);
}

// Функция для сброса зума
function resetZoom() {
    const prevScale = currentScale;
    currentScale = 1;
    applyZoom(prevScale);
}

// Функция для применения масштаба с сохранением позиции
function applyZoom(prevScale) {
    const modalImage = document.getElementById('modalImage');
    const imageContainer = document.querySelector('.modal-image-container');
    
    // Сохраняем текущую позицию скролла относительно центра
    const containerRect = imageContainer.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const containerCenterY = containerRect.top + containerRect.height / 2;
    
    const imageRect = modalImage.getBoundingClientRect();
    const imageCenterX = imageRect.left + imageRect.width / 2;
    const imageCenterY = imageRect.top + imageRect.height / 2;
    
    const relativeX = containerCenterX - imageCenterX;
    const relativeY = containerCenterY - imageCenterY;
    
    modalImage.style.transform = `scale(${currentScale})`;
    updateZoomIndicator();
    
    // Добавляем/убираем класс для курсора
    if (currentScale > 1) {
        modalImage.classList.add('zoomed');
    } else {
        modalImage.classList.remove('zoomed');
    }
    
    // Ждем обновления DOM и применяем новый скролл
    setTimeout(() => {
        const newImageRect = modalImage.getBoundingClientRect();
        const scaleRatio = currentScale / prevScale;
        
        // Рассчитываем новую позицию скролла
        const newScrollLeft = imageContainer.scrollLeft + (relativeX * scaleRatio - relativeX);
        const newScrollTop = imageContainer.scrollTop + (relativeY * scaleRatio - relativeY);
        
        imageContainer.scrollLeft = newScrollLeft;
        imageContainer.scrollTop = newScrollTop;
        
        // Если это сброс зума, центрируем изображение
        if (currentScale === 1) {
            setTimeout(() => {
                imageContainer.scrollLeft = (modalImage.scrollWidth - imageContainer.clientWidth) / 2;
                imageContainer.scrollTop = (modalImage.scrollHeight - imageContainer.clientHeight) / 2;
            }, 50);
        }
    }, 10);
}

// Функция для обновления индикатора зума
function updateZoomIndicator() {
    const zoomIndicator = document.querySelector('.zoom-indicator');
    if (zoomIndicator) {
        zoomIndicator.textContent = `Увеличение ${Math.round(currentScale * 100)}%`;
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики на все кнопки сертификатов
    const certButtons = document.querySelectorAll('.btn_sert');
    
    certButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.querySelector('.sert').src;
            openModal(imageSrc);
        });
    });
    
    // Обработчики для кнопок управления зумом
    document.getElementById('zoomIn').addEventListener('click', zoomIn);
    document.getElementById('zoomOut').addEventListener('click', zoomOut);
    document.getElementById('zoomReset').addEventListener('click', resetZoom);
    
    // Закрытие по клику на крестик
    document.getElementById('closeModal').addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
    
    // Закрытие по клику вне изображения
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Двойной клик по изображению для переключения зума
    document.getElementById('modalImage').addEventListener('dblclick', function(e) {
        e.stopPropagation();
        
        if (currentScale === 1) {
            currentScale = 2;
        } else {
            currentScale = 1;
        }
        
        applyZoom(1);
    });
    
    // Обработка колесика мыши для скролла увеличенного изображения
    const imageContainer = document.querySelector('.modal-image-container');
    
    imageContainer.addEventListener('wheel', function(e) {
        // Если изображение увеличено, разрешаем скролл
        if (currentScale > 1) {
            // Позволяем естественное поведение скролла
            return;
        } else {
            // Если не увеличено, предотвращаем скролл
            e.preventDefault();
        }
    });
    
    // Предотвращаем закрытие при клике на само изображение
    document.getElementById('modalImage').addEventListener('click', function(e) {
        e.stopPropagation();
    });
});