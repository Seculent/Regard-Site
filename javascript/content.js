window.RegardContent = (() => {
    const cache = {};
    async function load(name) {
        if (!cache[name]) {
            cache[name] = fetch(`content/${name}.json`, { cache: 'no-cache' })
                .then(response => {
                    if (!response.ok) throw new Error(`Не удалось загрузить content/${name}.json`);
                    return response.json();
                })
                .catch(error => {
                    delete cache[name];
                    throw error;
                });
        }
        return cache[name];
    }

    return { projects: () => load('projects'), news: () => load('news') };
})();
