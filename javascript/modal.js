// Функция для открытия модального окна
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Сбрасываем состояние при открытии нового изображения
    resetZoom();
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
    currentScale = Math.min(currentScale + scaleStep, maxScale);
    applyZoom();
}

// Функция для уменьшения изображения
function zoomOut() {
    currentScale = Math.max(currentScale - scaleStep, minScale);
    applyZoom();
}

// Функция для сброса зума
function resetZoom() {
    currentScale = 1;
    applyZoom();
    
    // Сбрасываем скролл к центру с задержкой для применения трансформации
    setTimeout(() => {
        const imageContainer = document.querySelector('.modal-image-container');
        imageContainer.scrollTop = (imageContainer.scrollHeight - imageContainer.clientHeight) / 2;
        imageContainer.scrollLeft = (imageContainer.scrollWidth - imageContainer.clientWidth) / 2;
    }, 10);
}

// Функция для применения масштаба
function applyZoom() {
    const modalImage = document.getElementById('modalImage');
    const imageContainer = document.querySelector('.modal-image-container');
    
    modalImage.style.transform = `scale(${currentScale})`;
    updateZoomIndicator();
    
    // Добавляем/убираем класс для курсора
    if (currentScale > 1) {
        modalImage.classList.add('zoomed');
        
        // После изменения масштаба прокручиваем к верху изображения
        setTimeout(() => {
            imageContainer.scrollTop = 0;
            imageContainer.scrollLeft = (imageContainer.scrollWidth - imageContainer.clientWidth) / 2;
        }, 10);
    } else {
        modalImage.classList.remove('zoomed');
        
        // Сбрасываем скролл к центру при обычном масштабе
        setTimeout(() => {
            imageContainer.scrollTop = (imageContainer.scrollHeight - imageContainer.clientHeight) / 2;
            imageContainer.scrollLeft = (imageContainer.scrollWidth - imageContainer.clientWidth) / 2;
        }, 10);
    }
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
        
        applyZoom();
    });
    
    // Обработка колесика мыши для скролла увеличенного изображения
    const imageContainer = document.querySelector('.modal-image-container');
    
    imageContainer.addEventListener('wheel', function(e) {
        // Если изображение увеличено, разрешаем скролл
        if (currentScale > 1) {
            // Позволяем естественное поведение скролла
            return;
        } else {
            // Если не увеличено, предотвращаем скролл (можно прокручивать страницу под модалкой)
            e.preventDefault();
        }
    });
    
    // Предотвращаем закрытие при клике на само изображение
    document.getElementById('modalImage').addEventListener('click', function(e) {
        e.stopPropagation();
    });
});