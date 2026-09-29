import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
    'index.html',
    'admin/index.html',
    'admin/config.yml',
    'content/projects.json',
    'content/news.json',
    'robots.txt',
    'sitemap.xml',
    'CNAME',
    'PDF/regard_brochure.pdf'
];

const htmlFiles = [
    'index.html',
    'admin/index.html'
];

const errors = [];

function normalizeReference(reference, htmlFile) {
    const trimmed = reference.trim();

    if (
        trimmed === '' ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('javascript:')
    ) {
        return null;
    }

    const withoutQuery = trimmed.split(/[?#]/, 1)[0];

    if (!withoutQuery) {
        return null;
    }

    if (withoutQuery.startsWith('/')) {
        return withoutQuery.replace(/^\/+/, '');
    }

    return path.normalize(
        path.join(path.dirname(htmlFile), withoutQuery)
    );
}

console.log('REGARD static site validator');
console.log('----------------------------');
console.log('');

console.log('Required release files:');

for (const file of requiredFiles) {
    const absolutePath = path.join(root, file);

    if (fs.existsSync(absolutePath)) {
        console.log(`OK: ${file}`);
    } else {
        console.error(`MISSING: ${file}`);
        errors.push(`Missing required file: ${file}`);
    }
}

console.log('');
console.log('Local HTML references:');

for (const htmlFile of htmlFiles) {
    const absoluteHtmlPath = path.join(root, htmlFile);

    if (!fs.existsSync(absoluteHtmlPath)) {
        continue;
    }

    const html = fs.readFileSync(absoluteHtmlPath, 'utf8');

    const referencePattern =
        /(?:src|href)\s*=\s*["']([^"']+)["']/gi;

    for (const match of html.matchAll(referencePattern)) {
        const reference = match[1];

        const resolved =
            normalizeReference(reference, htmlFile);

        if (!resolved) {
            continue;
        }

        const absoluteResolved =
            path.join(root, resolved);

        if (!fs.existsSync(absoluteResolved)) {
            console.error(
                `MISSING: ${htmlFile} -> ${reference}`
            );

            errors.push(
                `Missing local reference: ` +
                `${htmlFile} -> ${reference}`
            );
        }
    }
}

console.log('');

if (errors.length > 0) {
    console.error(
        `SITE VALIDATION FAILED: ${errors.length} error(s)`
    );

    for (const error of errors) {
        console.error(`- ${error}`);
    }

    process.exit(1);
}

console.log('SITE VALIDATION PASSED');
