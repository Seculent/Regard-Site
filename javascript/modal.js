// Управление просмотрщиком сертификатов
document.addEventListener('DOMContentLoaded', function() {
    const certificateImage = document.querySelector('.certificate-image-wrapper .sert');
    const thumbButtons = document.querySelectorAll('.thumb-btn');
    const zoomInBtn = document.getElementById('certZoomIn');
    const zoomOutBtn = document.getElementById('certZoomOut');
    const zoomResetBtn = document.getElementById('certZoomReset');
    const zoomIndicator = document.querySelector('.certificate-controls .zoom-indicator');
    
    let currentScale = 1;
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    // Функция для обновления индикатора зума
    function updateZoomIndicator() {
        zoomIndicator.textContent = `Увеличение ${Math.round(currentScale * 100)}%`;
    }
    
    // Функция для применения масштаба
    function applyScale() {
        certificateImage.style.transform = `scale(${currentScale})`;
        updateZoomIndicator();
    }
    
    // Увеличение
    zoomInBtn.addEventListener('click', function() {
        currentScale = Math.min(currentScale + 0.2, 3);
        applyScale();
    });
    
    // Уменьшение
    zoomOutBtn.addEventListener('click', function() {
        currentScale = Math.max(currentScale - 0.2, 1);
        applyScale();
        
        // Если масштаб 1x, сбрасываем позицию
        if (currentScale === 1) {
            certificateImage.parentElement.scrollLeft = 0;
            certificateImage.parentElement.scrollTop = 0;
        }
    });
    
    // Сброс зума
    zoomResetBtn.addEventListener('click', function() {
        currentScale = 1;
        applyScale();
        certificateImage.parentElement.scrollLeft = 0;
        certificateImage.parentElement.scrollTop = 0;
    });
    
    // Переключение между сертификатами
    thumbButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-src');
            
            // Обновляем активную кнопку
            thumbButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Меняем изображение
            certificateImage.src = imageSrc;
            
            // Сбрасываем масштаб
            currentScale = 1;
            applyScale();
            certificateImage.parentElement.scrollLeft = 0;
            certificateImage.parentElement.scrollTop = 0;
        });
    });
    
    // Перетаскивание изображения при увеличении
    certificateImage.addEventListener('mousedown', startDrag);
    
    function startDrag(e) {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.pageX - certificateImage.parentElement.offsetLeft;
            startY = e.pageY - certificateImage.parentElement.offsetTop;
            scrollLeft = certificateImage.parentElement.scrollLeft;
            scrollTop = certificateImage.parentElement.scrollTop;
            
            certificateImage.style.cursor = 'grabbing';
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - certificateImage.parentElement.offsetLeft;
        const y = e.pageY - certificateImage.parentElement.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        
        certificateImage.parentElement.scrollLeft = scrollLeft - walkX;
        certificateImage.parentElement.scrollTop = scrollTop - walkY;
    }
    
    function stopDrag() {
        isDragging = false;
        certificateImage.style.cursor = 'grab';
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
    
    // Скролл колесом мыши при увеличении
    certificateImage.parentElement.addEventListener('wheel', function(e) {
        if (currentScale > 1) {
            e.preventDefault();
            this.scrollLeft += e.deltaY;
        }
    });
    
    // Двойной клик для переключения зума
    certificateImage.addEventListener('dblclick', function(e) {
        e.preventDefault();
        
        if (currentScale === 1) {
            currentScale = 2;
        } else {
            currentScale = 1;
            certificateImage.parentElement.scrollLeft = 0;
            certificateImage.parentElement.scrollTop = 0;
        }
        
        applyScale();
    });
});