// Функция для открытия модального окна
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    // Показываем модальное окно сразу, но прозрачным
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Создаем временное изображение для получения размеров
    const tempImage = new Image();
    tempImage.onload = function() {
        // Устанавливаем источник основному изображению
        modalImage.src = imageSrc;
        
        // Рассчитываем оптимальный размер для модального окна
        const maxWidth = window.innerWidth - 40; // минус отступы
        const maxHeight = window.innerHeight - 40;
        
        let imageWidth = tempImage.width;
        let imageHeight = tempImage.height;
        
        // Если изображение больше окна - масштабируем
        if (imageWidth > maxWidth || imageHeight > maxHeight) {
            const widthRatio = maxWidth / imageWidth;
            const heightRatio = maxHeight / imageHeight;
            const scaleRatio = Math.min(widthRatio, heightRatio);
            
            imageWidth = imageWidth * scaleRatio;
            imageHeight = imageHeight * scaleRatio;
        }
        
        // Устанавливаем размеры модального окна
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.width = imageWidth + 'px';
        modalContent.style.height = 'auto'; // Высота будет определяться содержимым
        
        // Центрируем модальное окно
        modalContent.style.margin = 'auto';
    };
    
    tempImage.onerror = function() {
        // Если не удалось загрузить изображение, используем стандартный размер
        modalImage.src = imageSrc;
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.width = 'auto';
        modalContent.style.height = 'auto';
        modalContent.style.maxWidth = '90vw';
        modalContent.style.maxHeight = '90vh';
    };
    
    tempImage.src = imageSrc;
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Сбрасываем размеры модального окна
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.width = '';
    modalContent.style.height = '';
    
    // Сбрасываем фокус с активной кнопки
    if (document.activeElement) {
        document.activeElement.blur();
    }
}

// Обработчик изменения размера окна
function handleResize() {
    const modal = document.getElementById('imageModal');
    if (modal.classList.contains('active')) {
        const modalImage = document.getElementById('modalImage');
        const imageSrc = modalImage.src;
        
        // Если модальное окно открыто, пересчитываем размеры
        if (imageSrc) {
            // Временно закрываем и открываем модальное окно для перерасчета
            closeModal();
            setTimeout(() => openModal(imageSrc), 10);
        }
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
    
    // Предотвращаем закрытие при клике на само изображение
    document.getElementById('modalImage').addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', handleResize);
});

// Убираем обводку при фокусе
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn_sert');
    buttons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.outline = 'none';
        });
        button.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
});