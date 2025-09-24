// Функция для открытия модального окна
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Сбрасываем состояние при открытии нового изображения
    resetZoom();
    resetDrag();
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
    resetDrag();
}

// Переменные для управления зумом и перетаскиванием
let currentScale = 1;
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;
let dragStartX, dragStartY;

// Функция для увеличения изображения
function zoomIn() {
    const modalImage = document.getElementById('modalImage');
    const imageContainer = document.querySelector('.modal-image-container');
    
    currentScale = Math.min(currentScale + 0.2, 3);
    modalImage.style.transform = `scale(${currentScale})`;
    updateZoomIndicator();
}

// Функция для уменьшения изображения
function zoomOut() {
    const modalImage = document.getElementById('modalImage');
    
    currentScale = Math.max(currentScale - 0.2, 1);
    modalImage.style.transform = `scale(${currentScale})`;
    updateZoomIndicator();
    
    // Если масштаб 1x, центрируем изображение
    if (currentScale === 1) {
        resetDrag();
    }
}

// Функция для сброса зума
function resetZoom() {
    const modalImage = document.getElementById('modalImage');
    const imageContainer = document.querySelector('.modal-image-container');
    
    currentScale = 1;
    modalImage.style.transform = 'scale(1)';
    imageContainer.scrollLeft = imageContainer.scrollWidth / 2 - imageContainer.clientWidth / 2;
    imageContainer.scrollTop = imageContainer.scrollHeight / 2 - imageContainer.clientHeight / 2;
    updateZoomIndicator();
}

// Функция для сброса перетаскивания
function resetDrag() {
    const imageContainer = document.querySelector('.modal-image-container');
    imageContainer.scrollLeft = imageContainer.scrollWidth / 2 - imageContainer.clientWidth / 2;
    imageContainer.scrollTop = imageContainer.scrollHeight / 2 - imageContainer.clientHeight / 2;
}

// Функция для обновления индикатора зума
function updateZoomIndicator() {
    const zoomIndicator = document.querySelector('.zoom-indicator');
    if (zoomIndicator) {
        zoomIndicator.textContent = `Увеличение ${Math.round(currentScale * 100)}%`;
    }
}

// Функция для переключения зума по клику/двойному клику
function toggleZoom() {
    const modalImage = document.getElementById('modalImage');
    
    if (currentScale === 1) {
        currentScale = 1.8;
    } else {
        currentScale = 1;
    }
    
    modalImage.style.transform = `scale(${currentScale})`;
    updateZoomIndicator();
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
    
    // Зум по клику на изображение
    document.getElementById('modalImage').addEventListener('click', function(e) {
        if (currentScale === 1) {
            // Только если не увеличенно - увеличиваем по клику
            toggleZoom();
        }
        e.stopPropagation();
    });
    
    // Зум по двойному клику
    document.getElementById('modalImage').addEventListener('dblclick', function(e) {
        e.stopPropagation();
        toggleZoom();
    });
    
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
    
    // Функциональность перетаскивания для контейнера изображения
    const imageContainer = document.querySelector('.modal-image-container');
    
    imageContainer.addEventListener('mousedown', startDrag);
    imageContainer.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.pageX - imageContainer.offsetLeft;
            startY = e.pageY - imageContainer.offsetTop;
            scrollLeft = imageContainer.scrollLeft;
            scrollTop = imageContainer.scrollTop;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }
    }
    
    function startDragTouch(e) {
        if (currentScale > 1) {
            e.preventDefault();
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.pageX - imageContainer.offsetLeft;
            startY = touch.pageY - imageContainer.offsetTop;
            scrollLeft = imageContainer.scrollLeft;
            scrollTop = imageContainer.scrollTop;
            
            document.addEventListener('touchmove', dragTouch);
            document.addEventListener('touchend', stopDrag);
        }
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - imageContainer.offsetLeft;
        const y = e.pageY - imageContainer.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        imageContainer.scrollLeft = scrollLeft - walkX;
        imageContainer.scrollTop = scrollTop - walkY;
    }
    
    function dragTouch(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const x = touch.pageX - imageContainer.offsetLeft;
        const y = touch.pageY - imageContainer.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        imageContainer.scrollLeft = scrollLeft - walkX;
        imageContainer.scrollTop = scrollTop - walkY;
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', dragTouch);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
    
    // Скролл колесом мыши при увеличении
    imageContainer.addEventListener('wheel', function(e) {
        if (currentScale > 1) {
            e.preventDefault();
            imageContainer.scrollLeft += e.deltaY;
        }
    });
});