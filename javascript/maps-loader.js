(() => {
    const YANDEX_MAPS_API_URL = 'https://api-maps.yandex.ru/2.1/?apikey=562b26dd-47cf-42b4-8264-083d74ed910d&lang=ru_RU';
    const MAPS_READY_EVENT = 'regard:maps-ready';

    let loadStarted = false;

    function notifyMapsReady() {
        if (typeof window.ymaps === 'undefined') {
            console.error('Yandex Maps API loaded without ymaps namespace');
            return;
        }

        window.ymaps.ready(() => {
            window.dispatchEvent(new Event(MAPS_READY_EVENT));
        });
    }

    function loadYandexMapsApi() {
        if (loadStarted) return;
        loadStarted = true;

        if (typeof window.ymaps !== 'undefined') {
            notifyMapsReady();
            return;
        }

        const script = document.createElement('script');
        script.src = YANDEX_MAPS_API_URL;
        script.async = true;
        script.onload = notifyMapsReady;
        script.onerror = () => {
            console.error('Не удалось загрузить Yandex Maps API');
        };

        document.head.appendChild(script);
    }

    const mapTargets = [
        document.getElementById('geo-map'),
        document.getElementById('map')
    ].filter(Boolean);

    if (!mapTargets.length) return;

    if (!('IntersectionObserver' in window)) {
        loadYandexMapsApi();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        if (!entries.some(entry => entry.isIntersecting)) return;

        observer.disconnect();
        loadYandexMapsApi();
    }, {
        rootMargin: '800px 0px'
    });

    mapTargets.forEach(target => observer.observe(target));
})();
