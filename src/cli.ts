import { program } from 'commander';
import path from "path";
import fs from 'fs-extra';
import * as url from 'node:url';
import { convertGrammarToEcore } from './langium2ecore.js';

program
    .name('Langium to Ecore')
    .version((getCliVersion()))
    .description('Converts a Langium grammar\'s types to an Ecore model')
    .argument('<src>', 'Path to the grammar file')
    .option('-o, --output <out>', 'Path to the output file')
    .action(async (grammarPath: string, outputPath: string) => convertGrammarToEcore(grammarPath, outputPath))

program.showHelpAfterError();

program.parse(process.argv);

/**
 * @returns the version of the CLI as defined in package.json
 */
function getCliVersion(): string {
    const ownPackagePath = path.resolve(getDirname(), '..', 'package.json');
    const pack = fs.readJsonSync(ownPackagePath, { encoding: 'utf-8' });
    return pack.version;
}

/**
 * @returns the directory name of the CLI
 */
function getDirname(): string {
    return url.fileURLToPath(new URL('.', import.meta.url));
}