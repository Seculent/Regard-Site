// Функция для открытия модального окна
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modalImage.style.transform = 'scale(1)'; // Сбрасываем масштаб
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Добавляем класс для зума
    modalImage.classList.remove('zoomed');
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Функция для увеличения/уменьшения изображения
function toggleZoom(image) {
    image.classList.toggle('zoomed');
    if (image.classList.contains('zoomed')) {
        image.style.transform = 'scale(1.8)';
        image.style.cursor = 'zoom-out';
    } else {
        image.style.transform = 'scale(1)';
        image.style.cursor = 'zoom-in';
    }
}

// Функция для сброса зума при смене изображения
function resetZoom() {
    const modalImage = document.getElementById('modalImage');
    modalImage.classList.remove('zoomed');
    modalImage.style.transform = 'scale(1)';
    modalImage.style.cursor = 'zoom-in';
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
    
    // Обработчик для зума по клику на изображение
    document.getElementById('modalImage').addEventListener('click', function(e) {
        e.stopPropagation(); // Предотвращаем закрытие модального окна
        toggleZoom(this);
    });
    
    // Обработчик для зума по двойному клику
    document.getElementById('modalImage').addEventListener('dblclick', function(e) {
        e.stopPropagation();
        toggleZoom(this);
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
    
    // Сброс зума при открытии нового изображения
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'src') {
                resetZoom();
            }
        });
    });
    
    observer.observe(document.getElementById('modalImage'), {
        attributes: true,
        attributeFilter: ['src']
    });
});

// Добавляем поддержку жестов на мобильных устройствах
let initialDistance = null;

document.getElementById('modalImage').addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
});

document.getElementById('modalImage').addEventListener('touchmove', function(e) {
    if (e.touches.length === 2 && initialDistance) {
        e.preventDefault();
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        
        const scale = currentDistance / initialDistance;
        this.style.transform = `scale(${Math.max(1, Math.min(scale, 3))})`;
    }
});

document.getElementById('modalImage').addEventListener('touchend', function() {
    initialDistance = null;
});

