// Projects data
const projectsData = [
    // {
    //     title: "Квартал AVANT",
    //     description: "<p>Квартал AVANT от компании AAG расположен в историческом центре Санкт-Петербурга на территории бывшей текстильной фабрики — объекта культурного наследия архитектора Эриха Мендельсона. </p><br><p>Проект реализован по концепции 'город в городе' с сохранением комфортного человеческого масштаба. Архитекторы AAG создали обширные общественные пространства, уникальный лесной ландшафт в urban-среде и тщательно продуманные функциональные зоны. Каждый элемент квартала демонстрирует комплексный подход AAG к созданию качественной городской среды.</p><br>ООО РЕГАРД выполняет устройство фальцевой и рулонной кровель ревставрируемой фабрики. Объем работ: <br>Рулонной кровле: 5600 м2; <br> Скатной кровле: 7000 м2",
    //     images: ["JPG/AVANT/AVANT1.1.jpg", "JPG/AVANT/AVANT1.2.jpg", "JPG/AVANT/AVANT1.3.jpg", "JPG/AVANT/AVANT1.4.jpg"]
    // },
    {
        title: "ЖК 'А101 Лаголово'",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/LAG/Lag1.1.jpg", "JPG/LAG/Lag1.2.jpg", "JPG/LAG/Lag1.3.jpg", "JPG/LAG/Lag1.4.jpg"]
    },
    {
        title: "ЖК 'Курортный Квартал'",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/PES/PES1.1.jpg", "JPG/PES/PES1.2.jpg", "JPG/PES/PES1.3.jpg", "JPG/PES/PES1.4.jpg", "JPG/PES/PES1.5.jpg", "JPG/PES/PES1.6.jpg", "JPG/PES/PES1.7.jpg", "JPG/PES/PES1.8.jpg"]
    },
    {
        title: "ЖК 'Новые Лаврики'",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/LAV/LAV1.1.jpg", "JPG/LAV/LAV1.2.jpg", "JPG/LAV/LAV1.3.jpg", "JPG/LAV/LAV1.4.jpg", "JPG/LAV/LAV1.5.jpg"]
    },
    {
        title: "UP-Квартал Воронцовский",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/FSK/VRN1.1.jpg", "JPG/FSK/VRN1.2.jpg", "JPG/FSK/VRN1.3.jpg", "JPG/FSK/VRN1.4.jpg"]
    }
];

// Initialize projects functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectDescription = document.getElementById('modalProjectDescription');
    const modalGalleryImage = document.getElementById('modalGalleryImage');
    const modalGalleryThumbnails = document.getElementById('modalGalleryThumbnails');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    
    let currentProjectIndex = 0;
    let currentGalleryImageIndex = 0;

    // Обработчик открытия модального окна проекта
    document.getElementById('projectModal').addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const projectIndex = parseInt(button.getAttribute('data-project-index'));
        
        openProjectModal(projectIndex);
    });

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
    }

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

    function nextGalleryImage() {
        const project = projectsData[currentProjectIndex];
        const nextIndex = (currentGalleryImageIndex + 1) % project.images.length;
        showGalleryImage(nextIndex);
    }

    function prevGalleryImage() {
        const project = projectsData[currentProjectIndex];
        const prevIndex = (currentGalleryImageIndex - 1 + project.images.length) % project.images.length;
        showGalleryImage(prevIndex);
    }

    // Обработчики для галереи
    if (galleryPrev) galleryPrev.addEventListener('click', prevGalleryImage);
    if (galleryNext) galleryNext.addEventListener('click', nextGalleryImage);
});