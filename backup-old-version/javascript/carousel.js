// Слайд-шоу для секции "Наши объекты" с модальным окном
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelector('.slides');
    const slideItems = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const indicators = document.querySelectorAll('.indicator');
    
    // Элементы модального окна
    const projectModal = document.getElementById('projectModal');
    const closeProjectModal = document.getElementById('closeProjectModal');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectDescription = document.getElementById('modalProjectDescription');
    const modalGalleryImage = document.getElementById('modalGalleryImage');
    const modalGalleryThumbnails = document.getElementById('modalGalleryThumbnails');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    
    // Данные для проектов
    const projectsData = [
        {
            title: "Лаголово А101",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            images: ["JPG/OBJ-Logolovo.png", "JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo3.png"]
        },
        {
            title: "Живи в Песочном!",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            images: ["JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo.png", "JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo3.png"]
        },
        {
            title: "Новые Лаврики",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            images: ["JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo.png", "JPG/OBJ-Logolovo3.png"]
        },
        {
            title: "UP-Квартал Воронцовский",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            images: ["JPG/OBJ-Logolovo3.png", "JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo.png"]
        }
    ];
    
    let currentSlide = 0;
    const totalSlides = slideItems.length;
    let currentProjectIndex = 0;
    let currentGalleryImageIndex = 0;
    
    // Функция для показа слайда
    function showSlide(index) {
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Функция для открытия модального окна проекта
    function openProjectModal(projectIndex) {
        currentProjectIndex = projectIndex;
        currentGalleryImageIndex = 0;
        
        const project = projectsData[projectIndex];
        modalProjectTitle.textContent = project.title;
        modalProjectDescription.innerHTML = `<p>${project.description}</p>`;
        
        // Загружаем первую картинку в галерею
        modalGalleryImage.src = project.images[0];
        modalGalleryImage.alt = project.title;
        
        // Создаем миниатюры
        modalGalleryThumbnails.innerHTML = '';
        project.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `Миниатюра ${index + 1}`;
            thumbnail.classList.add('thumbnail');
            if (index === 0) thumbnail.classList.add('active');
            
            thumbnail.addEventListener('click', () => {
                showGalleryImage(index);
            });
            
            modalGalleryThumbnails.appendChild(thumbnail);
        });
        
        projectModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
    
    // Функция для показа изображения в галерее
    function showGalleryImage(index) {
        const project = projectsData[currentProjectIndex];
        if (index >= 0 && index < project.images.length) {
            currentGalleryImageIndex = index;
            modalGalleryImage.src = project.images[index];
            
            // Обновляем активную миниатюру
            const thumbnails = modalGalleryThumbnails.querySelectorAll('.thumbnail');
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }
    }
    
    // Функция для следующего изображения в галерее
    function nextGalleryImage() {
        const project = projectsData[currentProjectIndex];
        const nextIndex = (currentGalleryImageIndex + 1) % project.images.length;
        showGalleryImage(nextIndex);
    }
    
    // Функция для предыдущего изображения в галерее
    function prevGalleryImage() {
        const project = projectsData[currentProjectIndex];
        const prevIndex = (currentGalleryImageIndex - 1 + project.images.length) % project.images.length;
        showGalleryImage(prevIndex);
    }
    
    // Функция для закрытия модального окна
    function closeModal() {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Восстанавливаем скролл
    }
    
    // Обработчики событий для слайд-шоу
    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showSlide(index);
        });
    });
    
    // Обработчики для клика по слайдам
    slideItems.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            openProjectModal(index);
        });
    });
    
    // Обработчики для модального окна
    if (closeProjectModal) closeProjectModal.addEventListener('click', closeModal);
    if (galleryPrev) galleryPrev.addEventListener('click', prevGalleryImage);
    if (galleryNext) galleryNext.addEventListener('click', nextGalleryImage);
    
    // Закрытие модального окна по клику на оверлей
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Инициализация
    showSlide(0);
});