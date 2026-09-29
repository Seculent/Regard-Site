let GEO_OBJECTS = [];
let geoPlacemarks = [];
function registerGeoMapInit() {
    if (typeof window.ymaps === 'undefined') {
        window.addEventListener('regard:maps-ready', registerGeoMapInit, { once: true });
        return;
    }

    window.ymaps.ready(initGeoMap);
}

registerGeoMapInit();

function isValidGeoCoords(coords) {
    return Boolean(
        Array.isArray(coords) &&
        coords.length === 2 &&
        coords.every(Number.isFinite) &&
        coords[0] >= -90 &&
        coords[0] <= 90 &&
        coords[1] >= -180 &&
        coords[1] <= 180
    );
}

function isUsableMapProject(project) {
    return Boolean(
        project &&
        typeof project === 'object' &&
        project.published === true &&
        project.showOnMap === true &&
        typeof project.title === 'string' &&
        project.title.trim() !== '' &&
        project.map &&
        typeof project.map === 'object' &&
        isValidGeoCoords(project.map.coords) &&
        typeof project.map.address === 'string' &&
        project.map.address.trim() !== ''
    );
}

async function initGeoMap() {
    try {
        const projects = await window.RegardContent.projects();
        if (!Array.isArray(projects)) {
            throw new Error('content/projects.json должен содержать корневой JSON-массив');
        }

        const mapCandidates = projects.filter(project => project?.published === true && project?.showOnMap === true);
        GEO_OBJECTS = mapCandidates.filter(isUsableMapProject);

        if (GEO_OBJECTS.length !== mapCandidates.length) {
            console.warn('Некорректные опубликованные объекты исключены из карты:', mapCandidates.length - GEO_OBJECTS.length);
        }

        renderObjectList(GEO_OBJECTS);
        const geoMap = new ymaps.Map('geo-map', { center:[59.939095,30.315868], zoom:9, controls:['zoomControl','fullscreenControl'] }, { searchControlProvider:'yandex#search' });
        GEO_OBJECTS.forEach((project,index)=>{
            const placemark=new ymaps.Placemark(project.map.coords,{balloonContentHeader:escapeGeo(project.title),balloonContentBody:escapeGeo(project.map.address),hintContent:escapeGeo(project.title)},{preset:'islands#circleIcon',iconColor:project.map.markerColor||'#5c5b5b'});
            geoMap.geoObjects.add(placemark); geoPlacemarks.push(placemark);
            placemark.events.add('click',()=>setActiveObject(index));
        });
        window.geoMap=geoMap;
        bindObjectList();
    } catch(error){ console.error('Ошибка инициализации карты географии:',error); showGeoMapError(); }
}
function renderObjectList(projects){const list=document.querySelector('.objects-list');if(!list)return;list.innerHTML=projects.map((p,i)=>`<div class="object-item bg-dark bg-opacity-50 rounded-3 p-3 border border-light border-opacity-25 cursor-pointer" data-object-index="${i}"><div class="d-flex align-items-start"><div class="object-marker marker-1 me-3 mt-1"></div><div class="object-info"><h3 class="mb-2 fs-5">${escapeGeo(typeof p.map.listTitle==='string'&&p.map.listTitle.trim()!==''?p.map.listTitle:p.title)}</h3><p class="text-light mb-0 small">${escapeGeo(p.map.address)}</p></div></div></div>`).join('');}
function bindObjectList(){document.querySelectorAll('.object-item').forEach((item,index)=>item.addEventListener('click',()=>centerMapOnObject(index)));}
function setActiveObject(index){document.querySelectorAll('.object-item').forEach((item,i)=>item.classList.toggle('active',i===index));}
function centerMapOnObject(index){const p=GEO_OBJECTS[index];if(!p||!window.geoMap)return;setActiveObject(index);window.geoMap.setCenter(p.map.coords,14,{duration:500});geoPlacemarks[index]?.balloon.open();}
function showGeoMapError(){const c=document.getElementById('geo-map');if(c)c.innerHTML=`<div class="d-flex flex-column justify-content-center align-items-center h-100 text-center text-white p-4"><h3 class="text-danger mb-3">Ошибка загрузки карты</h3><p class="mb-3">Не удалось загрузить карту объектов</p><a href="https://yandex.ru/maps/2/saint-petersburg/" target="_blank" class="btn btn-outline-light">Посмотреть на Яндекс.Картах</a></div>`;}
function escapeGeo(v){const d=document.createElement('div');d.textContent=v??'';return d.innerHTML;}
