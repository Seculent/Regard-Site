let projectsData = [];

function renderProjectMarkdown(value) {
    const source = typeof value === 'string' ? value : '';

    // Безопасный fallback, если внешние библиотеки не загрузились.
    if (!window.marked || !window.DOMPurify) {
        const fallback = document.createElement('div');
        fallback.textContent = source;
        return fallback.innerHTML.replace(/\r?\n/g, '<br>');
    }
    const html = window.marked.parse(source, { breaks: true });
    return window.DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function getProjectImages(project) {
    if (!Array.isArray(project?.images)) return [];
    return project.images.filter(src => typeof src === 'string' && src.trim() !== '');
}

function isUsableCarouselProject(project) {
    return Boolean(
        project &&
        typeof project === 'object' &&
        project.published === true &&
        project.showInCarousel === true &&
        typeof project.id === 'string' &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id) &&
        typeof project.title === 'string' &&
        project.title.trim() !== '' &&
        typeof project.preview === 'string' &&
        project.preview.trim() !== '' &&
        getProjectImages(project).length > 0
    );
}

document.addEventListener('DOMContentLoaded', async function() {
    const indicators = document.querySelector('#projectsCarousel .carousel-indicators');
    const inner = document.querySelector('#projectsCarousel .carousel-inner');
    try {
        const allProjects = await window.RegardContent.projects();
        if (!Array.isArray(allProjects)) {
            throw new Error('content/projects.json должен содержать корневой JSON-массив');
        }

        const carouselCandidates = allProjects.filter(project => project?.published === true && project?.showInCarousel === true);
        projectsData = carouselCandidates.filter(isUsableCarouselProject);

        if (projectsData.length !== carouselCandidates.length) {
            console.warn('Некорректные опубликованные объекты исключены из карусели:', carouselCandidates.length - projectsData.length);
        }

        renderProjectCarousel(projectsData, indicators, inner);
        initProjectModal();
    } catch (error) {
        console.error('Ошибка загрузки объектов:', error);
    }
});

function renderProjectCarousel(projects, indicators, inner) {
    if (!indicators || !inner) return;
    indicators.innerHTML = projects.map((p,i) => `<button type="button" data-bs-target="#projectsCarousel" data-bs-slide-to="${i}"${i===0?' class="active" aria-current="true"':''} aria-label="${escapeAttribute(p.title)}"></button>`).join('');
    inner.innerHTML = projects.map((p,i) => `
        <div class="carousel-item${i===0?' active':''}" data-bs-interval="5000">
            <img src="${escapeAttribute(p.preview)}" class="d-block w-100 carousel-image" alt="${escapeAttribute(p.title)}"${i === 0 ? "" : ' loading="lazy"'}>
            <div class="carousel-caption"><h3>${escapeHtml(p.title)}</h3></div>
            <div class="carousel-click-overlay" data-bs-toggle="modal" data-bs-target="#projectModal" data-project-id="${escapeAttribute(p.id)}"></div>
        </div>`).join('');
}

function initProjectModal() {
    const modalEl=document.getElementById('projectModal'); if(!modalEl) return;
    const title=document.getElementById('modalProjectTitle'), desc=document.getElementById('modalProjectDescription'), image=document.getElementById('modalGalleryImage'), thumbs=document.getElementById('modalGalleryThumbnails');
    let current=null, imageIndex=0, currentImages=[];
    modalEl.addEventListener('show.bs.modal', e => { current=projectsData.find(p=>p.id===e.relatedTarget?.dataset.projectId); if(current) showProject(); });
    function showProject(){ currentImages=getProjectImages(current); if(!currentImages.length)return; imageIndex=0; title.textContent=current.title; desc.innerHTML=renderProjectMarkdown(current.description); image.src=currentImages[0]; image.alt=current.title; thumbs.innerHTML=''; currentImages.forEach((src,i)=>{const t=document.createElement('img');t.src=src;t.loading='lazy';t.alt=`Миниатюра ${i+1}`;t.className='thumbnail'+(i===0?' active':'');t.onclick=()=>showImage(i);thumbs.appendChild(t);}); }
    function showImage(i){if(!currentImages.length)return;imageIndex=(i+currentImages.length)%currentImages.length;image.src=currentImages[imageIndex];thumbs.querySelectorAll('.thumbnail').forEach((t,j)=>t.classList.toggle('active',j===imageIndex));}
    document.querySelector('.gallery-prev')?.addEventListener('click',()=>showImage(imageIndex-1));
    document.querySelector('.gallery-next')?.addEventListener('click',()=>showImage(imageIndex+1));
}

function escapeHtml(value){const d=document.createElement('div');d.textContent=value??'';return d.innerHTML;}
function escapeAttribute(value){return String(value??'').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
