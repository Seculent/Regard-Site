import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const validatorSource = path.join(scriptDir, 'validate-content.mjs');

function fail(message) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
}

function writeJson(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeFile(filePath, contents = 'test') {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, contents);
}

function createFixture() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'regard-validator-test-'));

    fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
    fs.copyFileSync(validatorSource, path.join(root, 'scripts', 'validate-content.mjs'));

    const projects = [
        {
            id: 'test-project',
            title: 'Тестовый объект',
            published: true,
            showInCarousel: true,
            showOnMap: true,
            preview: 'JPG/TEST/preview.jpg',
            images: ['JPG/TEST/image-1.jpg'],
            description: 'Описание',
            map: {
                address: 'Тестовый адрес',
                coords: [59.9, 30.3],
                listTitle: 'Тест',
                markerColor: '#5c5b5b'
            }
        }
    ];

    const news = [
        {
            id: 1,
            published: true,
            date: '29.09.2026',
            title: 'Тестовая новость',
            excerpt: 'Краткий текст',
            fullText: 'Полный текст'
        }
    ];

    writeJson(path.join(root, 'content', 'projects.json'), projects);
    writeJson(path.join(root, 'content', 'news.json'), news);
    writeFile(path.join(root, 'JPG', 'TEST', 'preview.jpg'));
    writeFile(path.join(root, 'JPG', 'TEST', 'image-1.jpg'));

    return root;
}

function runValidator(root) {
    const result = spawnSync(
        process.execPath,
        [path.join(root, 'scripts', 'validate-content.mjs')],
        {
            cwd: root,
            encoding: 'utf8'
        }
    );

    return {
        status: result.status,
        output: `${result.stdout ?? ''}${result.stderr ?? ''}`
    };
}

function readFixture(root) {
    return {
        projects: JSON.parse(fs.readFileSync(path.join(root, 'content', 'projects.json'), 'utf8')),
        news: JSON.parse(fs.readFileSync(path.join(root, 'content', 'news.json'), 'utf8'))
    };
}

function saveFixture(root, projects, news) {
    writeJson(path.join(root, 'content', 'projects.json'), projects);
    writeJson(path.join(root, 'content', 'news.json'), news);
}

function assertFailure(name, root, expectedFragments) {
    const result = runValidator(root);

    if (result.status === 0) {
        fail(`${name}: validator unexpectedly returned exit code 0`);
    }

    for (const fragment of expectedFragments) {
        if (!result.output.includes(fragment)) {
            fail(`${name}: expected output fragment not found: ${fragment}`);
        }
    }

    console.log(`PASS: ${name}`);
}

function expectFailure(name, mutate, expectedFragments) {
    const root = createFixture();

    try {
        const { projects, news } = readFixture(root);
        mutate({ root, projects, news });
        saveFixture(root, projects, news);
        assertFailure(name, root, expectedFragments);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
}

if (!fs.existsSync(validatorSource)) {
    fail('scripts/validate-content.mjs not found next to regression test');
}

// Positive fixture must pass.
{
    const root = createFixture();

    try {
        const result = runValidator(root);

        if (result.status !== 0) {
            console.error(result.output);
            fail(`valid fixture returned exit code ${result.status}`);
        }

        if (!result.output.includes('OK: projects=1, news=1, errors=0')) {
            fail('valid fixture did not produce expected OK summary');
        }

        console.log('PASS: valid fixture');
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
}

expectFailure(
    'duplicate project ID',
    ({ projects }) => {
        projects.push(structuredClone(projects[0]));
    },
    ['content/projects.json[1].id']
);

expectFailure(
    'missing media file',
    ({ projects }) => {
        projects[0].images[0] = 'JPG/TEST/missing.jpg';
    },
    ['content/projects.json[0].images[0]']
);

expectFailure(
    'invalid map coordinates',
    ({ projects }) => {
        projects[0].map.coords = [999, 30.3];
    },
    ['content/projects.json[0].map.coords']
);

expectFailure(
    'invalid published news date',
    ({ news }) => {
        news[0].date = '31.02.2026';
    },
    ['content/news.json[0].date']
);

expectFailure(
    'empty published news title',
    ({ news }) => {
        news[0].title = '';
    },
    ['content/news.json[0].title']
);

// Root-shape test writes a deliberately malformed root after fixture creation.
{
    const root = createFixture();

    try {
        writeJson(path.join(root, 'content', 'projects.json'), { invalid: true });
        assertFailure('project root is not an array', root, ['content/projects.json']);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
}

console.log('ALL VALIDATOR REGRESSION TESTS PASSED');
