import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function run(label, scriptName) {
    console.log(`=== ${label} ===`);

    const result = spawnSync(
        process.execPath,
        [path.join(scriptDir, scriptName)],
        {
            cwd: path.resolve(scriptDir, '..'),
            stdio: 'inherit'
        }
    );

    if (result.error) {
        console.error(`FAILED TO START: ${result.error.message}`);
        return 1;
    }

    if (result.status !== 0) {
        console.error(`${label} FAILED`);
        return result.status ?? 1;
    }

    console.log(`${label} PASSED`);
    console.log('');
    return 0;
}

const validationExitCode = run('CONTENT VALIDATION', 'validate-content.mjs');

if (validationExitCode !== 0) {
    process.exit(validationExitCode);
}

const regressionExitCode = run('VALIDATOR REGRESSION TESTS', 'test-content-validator.mjs');

if (regressionExitCode !== 0) {
    process.exit(regressionExitCode);
}

console.log('REGARD CONTENT CHECK PASSED');
