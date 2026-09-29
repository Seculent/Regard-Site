import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const productionBase = 'https://regard-spb.ru';

const localProjectsPath = path.join(
    root,
    'content',
    'projects.json'
);

const localNewsPath = path.join(
    root,
    'content',
    'news.json'
);

const failures = [];

function fail(message) {
    failures.push(message);
    console.error(`FAIL: ${message}`);
}

function pass(message) {
    console.log(`OK: ${message}`);
}

async function fetchProduction(pathname) {
    const url = new URL(pathname, productionBase);

    // Cache-buster helps ensure the smoke check is not satisfied
    // only by an older cached response.
    url.searchParams.set(
        '__regard_smoke',
        Date.now().toString()
    );

    try {
        const response = await fetch(url, {
            redirect: 'follow',
            signal: AbortSignal.timeout(20000),
            headers: {
                'User-Agent': 'REGARD-production-smoke/1.0',
                'Cache-Control': 'no-cache'
            }
        });

        const body = await response.text();

        console.log(
            `${response.status} ${pathname} ` +
            `[${response.headers.get('content-type') ?? 'no content-type'}]`
        );

        if (response.status !== 200) {
            fail(
                `${pathname} returned HTTP ${response.status}`
            );
        }

        return {
            response,
            body
        };
    } catch (error) {
        fail(
            `${pathname} request failed: ${error.message}`
        );

        return null;
    }
}

function parseJson(label, text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        fail(
            `${label} is not valid JSON: ${error.message}`
        );

        return null;
    }
}

function compareJson(label, localValue, remoteValue) {
    if (remoteValue === null) {
        return;
    }

    const localSerialized =
        JSON.stringify(localValue);

    const remoteSerialized =
        JSON.stringify(remoteValue);

    if (localSerialized !== remoteSerialized) {
        fail(
            `${label} differs from local source-of-truth`
        );

        return;
    }

    pass(
        `${label} matches local source-of-truth`
    );
}

console.log('REGARD production smoke check');
console.log('=============================');
console.log(`Production: ${productionBase}`);
console.log('');

const localProjects = JSON.parse(
    fs.readFileSync(localProjectsPath, 'utf8')
);

const localNews = JSON.parse(
    fs.readFileSync(localNewsPath, 'utf8')
);

console.log('=== HTTP ENDPOINTS ===');

const home = await fetchProduction('/');
const admin = await fetchProduction('/admin/');
const robots = await fetchProduction('/robots.txt');
const sitemap = await fetchProduction('/sitemap.xml');

const projectsResponse =
    await fetchProduction('/content/projects.json');

const newsResponse =
    await fetchProduction('/content/news.json');

console.log('');
console.log('=== PAGE IDENTITY ===');

if (
    home &&
    home.body.includes(
        '<link rel="canonical" href="https://regard-spb.ru/">'
    )
) {
    pass('homepage canonical URL');
} else {
    fail('homepage canonical URL missing or incorrect');
}

if (
    admin &&
    admin.body.includes('sveltia-cms.js')
) {
    pass('CMS loader present in /admin/');
} else {
    fail('CMS loader missing from /admin/');
}

if (
    robots &&
    robots.body.includes(
        'https://regard-spb.ru/sitemap.xml'
    )
) {
    pass('robots.txt references production sitemap');
} else {
    fail('robots.txt production sitemap reference');
}

if (
    sitemap &&
    sitemap.body.includes(
        '<loc>https://regard-spb.ru/</loc>'
    )
) {
    pass('sitemap contains production homepage');
} else {
    fail('sitemap production homepage entry');
}

console.log('');
console.log('=== PRODUCTION CONTENT ===');

const productionProjects =
    projectsResponse
        ? parseJson(
            'production projects.json',
            projectsResponse.body
        )
        : null;

const productionNews =
    newsResponse
        ? parseJson(
            'production news.json',
            newsResponse.body
        )
        : null;

if (Array.isArray(productionProjects)) {
    pass(
        `production projects array: ` +
        `${productionProjects.length} item(s)`
    );
} else if (productionProjects !== null) {
    fail('production projects root is not an array');
}

if (Array.isArray(productionNews)) {
    pass(
        `production news array: ` +
        `${productionNews.length} item(s)`
    );
} else if (productionNews !== null) {
    fail('production news root is not an array');
}

compareJson(
    'projects.json',
    localProjects,
    productionProjects
);

compareJson(
    'news.json',
    localNews,
    productionNews
);

console.log('');
console.log('=== RESULT ===');

if (failures.length > 0) {
    console.error(
        `PRODUCTION SMOKE FAILED: ` +
        `${failures.length} error(s)`
    );

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}

console.log(
    'REGARD PRODUCTION SMOKE PASSED'
);
