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

document.addEventListener('DOMContentLoaded', async function() {
    const indicators = document.querySelector('#projectsCarousel .carousel-indicators');
    const inner = document.querySelector('#projectsCarousel .carousel-inner');
    try {
        const allProjects = await window.RegardContent.projects();
        projectsData = allProjects.filter(project => project.published && project.showInCarousel);
        renderProjectCarousel(projectsData, indicators, inner);
        initProjectModal();
    } catch (error) {
        console.error('Ошибка загрузки объектов:', error);
    }
});

function renderProjectCarousel(projects, indicators, inner) {
    if (!indicators || !inner) return;
    indicators.innerHTML = projects.map((p,i) => `<button type="button" data-bs-target="#projectsCarousel" data-bs-slide-to="${i}"${i===0?' class="active" aria-current="true"':''} aria-label="${escapeHtml(p.title)}"></button>`).join('');
    inner.innerHTML = projects.map((p,i) => `
        <div class="carousel-item${i===0?' active':''}" data-bs-interval="5000">
            <img src="${p.preview}" class="d-block w-100 carousel-image" alt="${escapeHtml(p.title)}">
            <div class="carousel-caption"><h3>${escapeHtml(p.title)}</h3></div>
            <div class="carousel-click-overlay" data-bs-toggle="modal" data-bs-target="#projectModal" data-project-id="${p.id}"></div>
        </div>`).join('');
}

function initProjectModal() {
    const modalEl=document.getElementById('projectModal'); if(!modalEl) return;
    const title=document.getElementById('modalProjectTitle'), desc=document.getElementById('modalProjectDescription'), image=document.getElementById('modalGalleryImage'), thumbs=document.getElementById('modalGalleryThumbnails');
    let current=null, imageIndex=0;
    modalEl.addEventListener('show.bs.modal', e => { current=projectsData.find(p=>p.id===e.relatedTarget?.dataset.projectId); if(current) showProject(); });
    function showProject(){ imageIndex=0; title.textContent=current.title; desc.innerHTML=renderProjectMarkdown(current.description); image.src=current.images[0]; image.alt=current.title; thumbs.innerHTML=''; current.images.forEach((src,i)=>{const t=document.createElement('img');t.src=src;t.alt=`Миниатюра ${i+1}`;t.className='thumbnail'+(i===0?' active':'');t.onclick=()=>showImage(i);thumbs.appendChild(t);}); }
    function showImage(i){if(!current?.images.length)return;imageIndex=(i+current.images.length)%current.images.length;image.src=current.images[imageIndex];thumbs.querySelectorAll('.thumbnail').forEach((t,j)=>t.classList.toggle('active',j===imageIndex));}
    document.querySelector('.gallery-prev')?.addEventListener('click',()=>showImage(imageIndex-1));
    document.querySelector('.gallery-next')?.addEventListener('click',()=>showImage(imageIndex+1));
}
function escapeHtml(value){const d=document.createElement('div');d.textContent=value??'';return d.innerHTML;}
