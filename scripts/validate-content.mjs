import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

const errors = [];
const warnings = [];

function error(message) {
    errors.push(message);
}

function warning(message) {
    warnings.push(message);
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
}

function readJson(relativePath) {
    const fullPath = path.join(repoRoot, relativePath);

    let source;
    try {
        source = fs.readFileSync(fullPath, 'utf8');
    } catch (err) {
        error(`${relativePath}: не удалось прочитать файл (${err.message})`);
        return null;
    }

    try {
        return JSON.parse(source);
    } catch (err) {
        error(`${relativePath}: некорректный JSON (${err.message})`);
        return null;
    }
}

function validateBoolean(value, label) {
    if (typeof value !== 'boolean') {
        error(`${label}: ожидается boolean true/false`);
        return false;
    }
    return true;
}

function validateProjectId(value, label) {
    if (!isNonEmptyString(value)) {
        error(`${label}: ID обязателен`);
        return false;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        error(`${label}: ID должен содержать только lowercase latin, digits и hyphens`);
        return false;
    }

    return true;
}

function isValidDate(value) {
    if (typeof value !== 'string' || !/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
        return false;
    }

    const [day, month, year] = value.split('.').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function exactCaseFileExists(relativePath) {
    const segments = relativePath.split('/').filter(Boolean);
    let current = repoRoot;

    for (let i = 0; i < segments.length; i++) {
        let entries;
        try {
            entries = fs.readdirSync(current);
        } catch {
            return false;
        }

        if (!entries.includes(segments[i])) {
            return false;
        }

        current = path.join(current, segments[i]);
    }

    try {
        return fs.statSync(current).isFile();
    } catch {
        return false;
    }
}

function validateMediaPath(value, label) {
    if (!isNonEmptyString(value)) {
        error(`${label}: путь к изображению обязателен`);
        return;
    }

    const normalized = value.replace(/\\/g, '/');

    if (
        normalized.startsWith('/') ||
        /^[a-zA-Z]+:\/\//.test(normalized) ||
        normalized.split('/').includes('..')
    ) {
        error(`${label}: разрешён только repo-relative путь без URL, leading slash и ".."`);
        return;
    }

    if (!normalized.startsWith('JPG/')) {
        error(`${label}: путь должен начинаться с "JPG/"`);
        return;
    }

    if (!exactCaseFileExists(normalized)) {
        error(`${label}: файл не найден с точным регистром пути: ${normalized}`);
    }
}

function validateCoords(value, label) {
    if (
        !Array.isArray(value) ||
        value.length !== 2 ||
        !value.every(Number.isFinite)
    ) {
        error(`${label}: coords должны быть массивом из двух чисел [lat, lon]`);
        return false;
    }

    const [lat, lon] = value;

    if (lat < -90 || lat > 90) {
        error(`${label}: latitude вне диапазона -90..90`);
        return false;
    }

    if (lon < -180 || lon > 180) {
        error(`${label}: longitude вне диапазона -180..180`);
        return false;
    }

    return true;
}

function validateProjects(projects) {
    const file = 'content/projects.json';

    if (!Array.isArray(projects)) {
        error(`${file}: корень должен быть JSON-массивом`);
        return;
    }

    const ids = new Set();

    projects.forEach((project, index) => {
        const prefix = `${file}[${index}]`;

        if (!project || typeof project !== 'object' || Array.isArray(project)) {
            error(`${prefix}: элемент должен быть объектом`);
            return;
        }

        if (validateProjectId(project.id, `${prefix}.id`)) {
            if (ids.has(project.id)) {
                error(`${prefix}.id: дублирующий ID "${project.id}"`);
            }
            ids.add(project.id);
        }

        if (!isNonEmptyString(project.title)) {
            error(`${prefix}.title: непустой title обязателен`);
        }

        const publishedOk = validateBoolean(project.published, `${prefix}.published`);
        const carouselOk = validateBoolean(project.showInCarousel, `${prefix}.showInCarousel`);
        const mapOk = validateBoolean(project.showOnMap, `${prefix}.showOnMap`);

        // Любая указанная media-ссылка должна быть валидной,
        // даже если объект пока скрыт.
        if (project.preview !== undefined && project.preview !== null && project.preview !== '') {
            validateMediaPath(project.preview, `${prefix}.preview`);
        }

        if (project.images !== undefined && !Array.isArray(project.images)) {
            error(`${prefix}.images: ожидается массив`);
        } else if (Array.isArray(project.images)) {
            project.images.forEach((image, imageIndex) => {
                validateMediaPath(image, `${prefix}.images[${imageIndex}]`);
            });
        }

        if (!publishedOk || project.published !== true) {
            return;
        }

        if (carouselOk && project.showInCarousel === true) {
            if (!isNonEmptyString(project.preview)) {
                error(`${prefix}.preview: обязателен для опубликованного объекта в карусели`);
            }

            if (!Array.isArray(project.images) || project.images.length === 0) {
                error(`${prefix}.images: нужна минимум 1 картинка для опубликованного объекта в карусели`);
            }

            if (!isNonEmptyString(project.description)) {
                error(`${prefix}.description: обязателен для опубликованного объекта в карусели`);
            }
        }

        if (mapOk && project.showOnMap === true) {
            if (!project.map || typeof project.map !== 'object' || Array.isArray(project.map)) {
                error(`${prefix}.map: объект map обязателен для опубликованного объекта на карте`);
                return;
            }

            validateCoords(project.map.coords, `${prefix}.map.coords`);

            if (!isNonEmptyString(project.map.address)) {
                error(`${prefix}.map.address: непустой адрес обязателен`);
            }

            if (
                project.map.listTitle !== undefined &&
                project.map.listTitle !== null &&
                typeof project.map.listTitle !== 'string'
            ) {
                error(`${prefix}.map.listTitle: ожидается строка`);
            }

            if (
                project.map.markerColor !== undefined &&
                project.map.markerColor !== null &&
                typeof project.map.markerColor !== 'string'
            ) {
                error(`${prefix}.map.markerColor: ожидается строка`);
            }
        }
    });
}

function validateNews(news) {
    const file = 'content/news.json';

    if (!Array.isArray(news)) {
        error(`${file}: корень должен быть JSON-массивом`);
        return;
    }

    const ids = new Set();

    news.forEach((item, index) => {
        const prefix = `${file}[${index}]`;

        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            error(`${prefix}: элемент должен быть объектом`);
            return;
        }

        if (!Number.isInteger(item.id) || item.id <= 0) {
            error(`${prefix}.id: ID должен быть положительным целым числом`);
        } else {
            if (ids.has(item.id)) {
                error(`${prefix}.id: дублирующий ID ${item.id}`);
            }
            ids.add(item.id);
        }

        const publishedOk = validateBoolean(item.published, `${prefix}.published`);

        const dateProvided = item.date !== undefined && item.date !== null && item.date !== '';

        if (dateProvided && !isValidDate(item.date)) {
            error(`${prefix}.date: ожидается реальная дата DD.MM.YYYY`);
        }

        if (!publishedOk || item.published !== true) {
            return;
        }

        if (!dateProvided) {
            error(`${prefix}.date: дата DD.MM.YYYY обязательна для опубликованной новости`);
        }

        if (!isNonEmptyString(item.title)) {
            error(`${prefix}.title: непустой title обязателен для опубликованной новости`);
        }

        if (!isNonEmptyString(item.excerpt)) {
            error(`${prefix}.excerpt: непустой excerpt обязателен для опубликованной новости`);
        }

        if (!isNonEmptyString(item.fullText)) {
            error(`${prefix}.fullText: непустой fullText обязателен для опубликованной новости`);
        }
    });
}

const projects = readJson('content/projects.json');
const news = readJson('content/news.json');

if (projects !== null) validateProjects(projects);
if (news !== null) validateNews(news);

console.log('REGARD content validator');
console.log('------------------------');

if (warnings.length > 0) {
    console.log(`WARNINGS: ${warnings.length}`);
    warnings.forEach((message, index) => console.log(`  W${index + 1}. ${message}`));
    console.log('');
}

if (errors.length > 0) {
    console.error(`FAILED: ${errors.length} error(s)`);
    errors.forEach((message, index) => console.error(`  E${index + 1}. ${message}`));
    process.exitCode = 1;
} else {
    const projectCount = Array.isArray(projects) ? projects.length : 0;
    const newsCount = Array.isArray(news) ? news.length : 0;

    console.log(`OK: projects=${projectCount}, news=${newsCount}, errors=0`);
}
