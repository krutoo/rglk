/**
 * This script will build package.
 */
import fs from 'node:fs/promises';
import { $ } from './utils.ts';

// clean dist folder
await fs.rm('./dist', { recursive: true, force: true });

// build .js files
await $('npx tsc -p tsconfig.build.json');

// resolve import paths
await $('tsc-alias -p tsconfig.build.json');

// format (for reduce package size by replacing indent from 4 to 2)
await $('npx prettier "dist/**/*.js" -w --log-level=error --ignore-path=./.nonexistent');
