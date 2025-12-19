// Projects data
const projectsData = [
    // {
    //     title: "Квартал AVANT",
    //     description: "<p>Квартал AVANT от компании AAG расположен в историческом центре Санкт-Петербурга на территории бывшей текстильной фабрики — объекта культурного наследия архитектора Эриха Мендельсона. </p><br><p>Проект реализован по концепции 'город в городе' с сохранением комфортного человеческого масштаба. Архитекторы AAG создали обширные общественные пространства, уникальный лесной ландшафт в urban-среде и тщательно продуманные функциональные зоны. Каждый элемент квартала демонстрирует комплексный подход AAG к созданию качественной городской среды.</p><br>ООО РЕГАРД выполняет устройство фальцевой и рулонной кровель ревставрируемой фабрики. Объем работ: <br>Рулонной кровле: 5600 м2; <br> Скатной кровле: 7000 м2",
    //     images: ["JPG/AVANT/AVANT1.1.jpg", "JPG/AVANT/AVANT1.2.jpg", "JPG/AVANT/AVANT1.3.jpg", "JPG/AVANT/AVANT1.4.jpg"]
    // },
    {
        title: "ЖК «А101 Лаголово»",
        description: "<p style=\"text-align: justify\">ГК А101 возводит современный жилой комплекс у подножия знаменитых Дудергофских высот, в окружении чистых озёр и живописных природных массивов. Проект включает всё необходимое для комфортной жизни: экотропы для прогулок и панорамные виды с самой высокой точки Санкт-Петербурга.</p><hr> ООО РЕГАРД, как подрядчик, выполняет работы по устройству кровель домов 1-ой очереди строительства.<br><br>По состоянию на конец 2025 года: <br><ul><li>Ведутся работы по устройству кровель домов 1.3.1, 1.3.2 (слайд №4).</li><li>Общая площадь выполненных работ  составляет более <strong>7 000 м2</strong></li></ul>",
        images: ["JPG/LAG/Lag1.1.jpg", "JPG/LAG/Lag1.2.jpg", "JPG/LAG/Lag1.3.jpg", "JPG/LAG/Lag1.4.jpg"]
    },
    {
        title: "ЖК «Курортный Квартал»",
        description: "<p style=\"text-align: justify\"><strong>ГК Самолет</strong> реализует проект жилого комплекса комфорт-класса «Курортный Квартал» в 20 минутах от Финского залива, в одноименном районе Санкт-Петербурга, рядом с тенистым лесопарком. Проект предлагает жителям сочетание природных преимуществ — свежего морского бриза, высоких сосен, зелёных зон — с комфортом городской жизни и развитой инфраструктурой.</p><hr>Компанией ООО РЕГАРД выполнено устройство кровель нескольких очередей строительства «Курортного Квартала».<br><br>По состоянию на конец 2025 года: <br><ul><li>Выполнены работы по устройству кровель участков 580-596;</li><li>Общая площадь выполненных работ составялет более <strong>15 000 м2</strong></li></ul>",
        images: ["JPG/PES/PES1.1.jpg", "JPG/PES/PES1.2.jpg", "JPG/PES/PES1.3.jpg", "JPG/PES/PES1.4.jpg", "JPG/PES/PES1.5.jpg", "JPG/PES/PES1.6.jpg", "JPG/PES/PES1.7.jpg", "JPG/PES/PES1.8.jpg"]
    },
    {
        title: "ЖК «Новые Лаврики»",
        description: "<p style=\"text-align: justify\"><strong>ГК Самолет</strong> создаёт жилой комплекс «Новые Лаврики», вдохновлённый северной природой — сосновыми лесами, озёрными просторами и живописными каменистыми берегами. Расположение комплекса предлагает жителям активный отдых в экологичной среде: скандинавская ходьба в хвойных массивах, глэмпинг у водоёмов, лыжные прогулки в парковых зонах — при этом в 30 минутах от центра Санкт-Петербурга. Архитектурное решение комплекса выполнено в лаконичном скандинавском стиле, гармонично вписывающемся в окружающий пейзаж.</p><hr>ООО РЕГАРД выполненяет устройство кровель 1-ой очереди строительства.<br><br>По состоянию на конец 2025 года: <br><ul><li>Выполнены работы по устройству кровель участков 1.1, 1.3;</li><li>Общая площадь выполненных работ составялет <strong>3 000 м2</strong></li></ul>",
        images: ["JPG/LAV/LAV1.1.jpg", "JPG/LAV/LAV1.2.jpg", "JPG/LAV/LAV1.3.jpg", "JPG/LAV/LAV1.4.jpg", "JPG/LAV/LAV1.5.jpg"]
    },
    {
        title: "ЖК «Астрид»",
        description: "<p style=\"text-align: justify\"><strong>ООО «СПб Недвижимость».</strong> Где жить, если нравятся размеренные дни на природе, но иногда хочется двигаться вместе с динамичным ритмом мегаполиса? Квартира вашей мечты находится в нашем квартале «Новое Колпино».</p><hr>ООО РЕГАРД выполненяет устройство кровли корпуса №10.<br><br>По состоянию на конец 2025 года: <br><ul><li>Работы по устройству кровли выполнены в полном объеме;</li><li>Общая площадь выполненных работ составялет <strong>2 000 м2</strong></li></ul>",
        images: ["JPG/KOLP/KOLP1.1.jpg"]
    },
    {
        title: "ЖК «Новое Колпино»",
        description: "<p style=\"text-align: justify\"><strong>ООО «СПб Недвижимость».</strong> Утопающий в зелени квартал «Новое Колпино» — идеальное место, чтобы растить детей и создавать размеренную жизнь. В 15 минутах езды от дома находится сразу 10 зеленых зон — сквер Коммуны, Городской и Троицкий сады, Никольский и Харламов скверы, сад Урицкого, скверы Володарского, Героев-Ижорцев и Защитников Отечества. Самая крупная из них — Колпинский парк — расположена на берегу реки Ижоры. Летом здесь можно загорать на пляже, кататься на аттракционах и кормить лебедей, взять лодку и наслаждаться видами с воды, после сыграть партию в бадминтон или волейбол. А осенью так приятно шагать по дорожкам, усыпанным листьями, и кормить белок орехами.</p><hr>ООО РЕГАРД выполненяет устройство кровель нескольких очередей строительства.<br><br>По состоянию на конец 2025 года: <br><ul><li>Выполняются работы по устройству кровли жилого дома на учаске №33;</li><li>Общая площадь выполненных работ составялет <strong>10 000 м2</strong></li></ul>",
        images: ["JPG/KKR/KKR1.1.jpg", "JPG/KKR/KKR1.2.jpg", "JPG/KKR/KKR1.3.jpg"]
    },
    {    
        title: "ЖК «Невская долина»",
        description: "<p style=\"text-align: justify\"><strong>ГК «Самолет».</strong> «Невская Долина» — это зеленый холст для вашей жизни. Уникальные палисадники, где каждый может высаживать собственные цветы, дают жителям возможность сделать пространство по-настоящему своим. Дворы с садами и парками, деревянными детскими площадками и уютными уголками для отдыха наполняют комплекс теплом и спокойствием, как в старинных садах Петербурга.</p><hr>ООО РЕГАРД выполненяет устройство кровель 1-ой очереди строительства.<br><br>По состоянию на конец 2025 года: <br><ul><li>Работы по устройству кровли дома 1.1 выполнены в полном объеме;</li><li>Общая площадь выполненных работ составялет <strong>3 000 м2</strong></li></ul>",
        images: ["JPG/NVS/NVS1.1.jpg", "JPG/NVS/NVS1.2.jpg", "JPG/NVS/NVS1.3.jpg", "JPG/NVS/NVS1.4.jpg"]
    },
    {
        title: "ЖК «UP-Квартал Воронцовский»",
        description: "<p style=\"text-align: justify\"><strong>ГК ФСК</strong> создаёт жилой комплекс UP-квартал «Воронцовский» в Новом Девяткино, молодом и наиболее активно развивающемся районе петербургской агломерации, великолепно интегрированном в транспортную и социальную инфраструктуру Ленинградской области и Петербурга.</p><hr>ООО РЕГАРД выполненяет устройство кровель 1-ой очереди строительства.<br><br>По состоянию на конец 2025 года: <br><ul><li>Выполнены работы по устройству кровли корпуса Б;</li><li>Общая площадь выполненных работ составялет <strong>3 000 м2</strong></li></ul>",
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