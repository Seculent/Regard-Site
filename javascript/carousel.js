// Projects data
const projectsData = [
    {
        title: "Лаголово А101",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/OBJ-Logolovo.png", "JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo3.png"]
    },
    {
        title: "Живи в Песочном!",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo.png", "JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo3.png"]
    },
    {
        title: "Новые Лаврики",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo.png", "JPG/OBJ-Logolovo3.png"]
    },
    {
        title: "UP-Квартал Воронцовский",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        images: ["JPG/OBJ-Logolovo3.png", "JPG/OBJ-Logolovo1.png", "JPG/OBJ-Logolovo2.png", "JPG/OBJ-Logolovo.png"]
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